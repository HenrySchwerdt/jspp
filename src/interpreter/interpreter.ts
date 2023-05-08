import { EmptyVisitor } from "../analysis/symbols";
import { AssignStatement, BinaryExpression, BlockStatement, CallExpression, CallStatement, DeclarationStatement, Expression, FnDeclaration, IfStatement, LiteralExpression, Operator, Program, Statement, VarKind, Variable, VariableExpression, WhileStatement } from "../representation/ast";
export class STD {
    env: Environment
    constructor(env: Environment) {
        this.env = env;
    }
    initSTDFunctions() {
        this.initPrint()
        this.initPrintLn()
    }
    initPrint() {
        this.env.declare("print", (x: any) => x != undefined ? process.stdout.write(x + "") : process.stdout.write(""))
    }
    initPrintLn() {
        this.env.declare("println", (x: any) => x != undefined ? process.stdout.write(x + "\n") : process.stdout.write("\n"))
    }
}

export class Environment {
    private readonly entries = new Map<string, any>()
    private readonly outer: Environment | undefined
    constructor(outer: Environment | undefined) {
        this.outer = outer
    }
    declare(name: string, value: any) {
        this.entries.set(name, value)
    }
    reassign(name: string, value: any) {
        if (this.entries.has(name)) {
            this.entries.set(name, value)
        } else {
            if (this.outer) {
                this.outer.reassign(name, value)
            }
        }
    }
    lookup(name: string): any {
        if (this.entries.has(name)) {
            return this.entries.get(name)
        } else {
            if (this.outer) {
                return this.outer.lookup(name)
            }
        }
        return undefined
    }
}

export class Interpreter extends EmptyVisitor {
    private readonly env: Environment = new Environment(undefined)
    private isDec: boolean = false
    constructor() {
        super()
        new STD(this.env).initSTDFunctions()
    }
    public interpret(ast: Program) {
        ast.accept(this)

    }
    visitCallExpression(ctx: CallExpression): void {
        this.evaluateExpression(ctx)
    }
    visitCallStatement(ctx: CallStatement): void {
        ctx.callExpression.accept(this)
    }
    visitFnDeclaration(ctx: FnDeclaration): void {
        this.env.declare(ctx.name, (parameter: Expression[]) => {
            let count = 0;
            const dec : Statement = new DeclarationStatement(ctx.body.position, VarKind.let, ctx.paramter.map(param => {
                return new AssignStatement(ctx.body.position, new Variable(param.position, param.name, param.type), parameter[count++] )
            }))
            const body : Statement[] = [dec].concat(ctx.body.body)
            ctx.body.body = body
            ctx.body.accept(this)
        })
    }
    visitProgram(ctx: Program): void {
        for (let stmt of ctx.body) {
            stmt.accept(this)
        }
    }
    visitDeclarationStatement(ctx: DeclarationStatement): void {
        for (let dec of ctx.declarations) {
            this.isDec = true
            dec.accept(this)
            this.isDec = false
        }
    }
    visitAssignStatement(ctx: AssignStatement): void {
        const value = this.evaluateExpression(ctx.value)
        if (this.isDec) {
            this.env.declare(ctx.target.name, value)
        } else {
            this.env.reassign(ctx.target.name, value)
        }
    }
    visitIfStatement(ctx: IfStatement): void {
        const res = this.evaluateExpression(ctx.condition)
        if (res) {
            ctx.consequent.body.map(x => x.accept(this))
        } else if (!res && ctx.alternate) {
            ctx.alternate.body.map(x => x.accept(this))
        }
    }
    visitWhileStatement(ctx: WhileStatement): void {
        while(this.evaluateExpression(ctx.condition)) {
            ctx.body.accept(this)
        }
    }
    visitBlockStatement(ctx: BlockStatement): void {
        ctx.body.map(stmt => stmt.accept(this))
    }
    visitBinaryExpression(ctx: BinaryExpression): void {
    }
    visitVariableExpression(ctx: VariableExpression): void {
    }
    visitVariable(ctx: Variable): void {
    }
    evaluateExpression(expr: Expression): any {
        if (expr instanceof VariableExpression) {
            return this.env.lookup((expr as VariableExpression).variable.name)
        }
        if (expr instanceof BinaryExpression) {
            const x = this.evaluateExpression(expr.leftOperand)
            const y = this.evaluateExpression(expr.rightOperand)
            switch (expr.operator) {
                case Operator.ADD:
                    return x + y
                case Operator.SUB:
                    return x - y
                case Operator.DIV:
                    return Math.floor(x / y)
                case Operator.MUL:
                    return x * y
                case Operator.EQU:
                    return x == y
                case Operator.GRE:
                    return x >= y
                case Operator.GRT:
                    return x > y
                case Operator.LSE:
                    return x <= y
                case Operator.LST:
                    return x < y
            }
        }
        if (expr instanceof LiteralExpression) {
            return expr.value
        }
        if (expr instanceof CallExpression) {
            if (expr.name == 'print' || expr.name == 'println') {
                const evaluatedParamters = expr.paramters.map(x => this.evaluateExpression(x))
                const fn = this.env.lookup(expr.name)
                fn(...evaluatedParamters)
            } else {
                const fn = this.env.lookup(expr.name)
                fn(expr.paramters)
            }
            
        }
    }

}