import { EmptyVisitor } from "../analysis/symbols";
import { AssignStatement, BinaryExpression, BoolLiteralExpression, CallExpression, CallStatement, DeclarationStatement, Expression, F32LiteralExpression, F64LiteralExpression, FnDeclaration, I16LiteralExpression, I32LiteralExpression, I64LiteralExpression, I8LiteralExpression, Operator, Program, StrLiteralExpression, Variable, VariableExpression } from "../representation/ast";

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
    private readonly env : Environment = new Environment(undefined)
    private isDec: boolean = false
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
        for(let stmt of ctx.body) {
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
    visitBinaryExpression(ctx: BinaryExpression): void {
    }
    visitVariableExpression(ctx: VariableExpression): void {
    }
    visitI8LiteralExpression(ctx: I8LiteralExpression): void {
    }
    visitI16LiteralExpression(ctx: I16LiteralExpression): void {
    }
    visitI32LiteralExpression(ctx: I32LiteralExpression): void {
    }
    visitI64LiteralExpression(ctx: I64LiteralExpression): void {
    }
    visitStrLiteralExpression(ctx: StrLiteralExpression): void {
    }
    visitBoolLiteralExpression(ctx: BoolLiteralExpression): void {
    }
    visitF32LiteralExpression(ctx: F32LiteralExpression): void {
    }
    visitF64LiteralExpression(ctx: F64LiteralExpression): void {
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
            switch(expr.operator) {
                case Operator.ADD:
                    return x + y
                case Operator.SUB:
                    return x - y
                case Operator.DIV:
                    return Math.floor(x/y)
                case Operator.MUL:
                    return x * y
            }
        }
        if (expr instanceof I32LiteralExpression) {
            return expr.value
        }
        if (expr instanceof CallExpression) {
            const evaluatedParamters = expr.paramters.map(x => this.evaluateExpression(x))
            console.log(...evaluatedParamters)
        }
    }
    
}