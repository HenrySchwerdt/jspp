import { EmptyVisitor } from "../analysis/symbols";
import { AssignStatement, BinaryExpression, CallExpression, CallStatement, DeclarationStatement, Expression, FnDeclaration, IfStatement, LiteralExpression, Operator, Program, Variable, VariableExpression } from "../representation/ast";
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
        this.env.declare("print", (x: any) => x ? process.stdout.write(x + "") : process.stdout.write(""))
    }
    initPrintLn() {
        this.env.declare("println", (x: any) => x ? process.stdout.write(x + "\n") : process.stdout.write("\n"))
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
        if (this.evaluateExpression(ctx.condition)) {
            ctx.consequent.body.map(x => x.accept(this))
        } else if (ctx.alternate) {
            ctx.alternate.body.map(x => x.accept(this))
        }
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
            const evaluatedParamters = expr.paramters.map(x => this.evaluateExpression(x))
            const fn = this.env.lookup(expr.name)
            fn(...evaluatedParamters)
        }
    }

}