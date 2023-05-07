import { Position } from "../parser/token";

export enum Operator {
    ADD, SUB, MUL, DIV, EQU, NEQ, LST, LSE, GRT, GRE
}

export enum Type {
    i8, i16, i32, i64, f32, f64, str, bool, unknown
}

export enum VarKind {
    let, const
}

export function isArithmetic(op: Operator) : boolean {
    return [Operator.ADD, Operator.SUB, Operator.MUL, Operator.DIV].includes(op)
}

export function isComparison(op: Operator): boolean {
    return !isArithmetic(op);
}

export interface Visitor {
    visit(ctx: Program): void;
    visit(ctx: DeclarationStatement): void;
    visit(ctx: AssignStatement): void;
    visit(ctx: DeclarationStatement): void;
    visit(ctx: BinaryExpression): void;
    visit(ctx: VariableExpression): void;
    visit(ctx: I8LiteralExpression): void;
    visit(ctx: I16LiteralExpression): void;
    visit(ctx: I32LiteralExpression): void;
    visit(ctx: I64LiteralExpression): void;
    visit(ctx: StrLiteralExpression): void;
    visit(ctx: BoolLiteralExpression): void;
    visit(ctx: F32LiteralExpression): void;
    visit(ctx: F64LiteralExpression): void;
    visit(ctx: Variable): void;
}



export abstract class Node {
    public readonly position: Position;

    constructor(position: Position) {
        this.position = position
    }
    abstract accept(v: Visitor): void
}

export class Program extends Node {
    readonly body: Statement[]
    constructor(position: Position, body: Statement[]) {
        super(position)
        this.body = body
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export abstract class Statement extends Node {
    constructor(position: Position) {
        super(position)
    }
}

export class DeclarationStatement extends Statement {
    public readonly kind: VarKind
    public readonly declarations: AssignStatement[]
    constructor(position:Position, kind: VarKind, declarations: AssignStatement[]) {
        super(position)
        this.kind = kind;
        this.declarations = declarations
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export class AssignStatement extends Statement {
    public readonly target: Variable
    public readonly value: Expression
    constructor(position:Position, target: Variable, value: Expression) {
        super(position)
        this.target = target
        this.value = value
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export abstract class Expression extends Node {
    public dataType: Type = Type.unknown
    constructor(position: Position) {
        super(position)
    }
}

export class BinaryExpression extends Expression {
    public readonly operator: Operator
    public readonly leftOperand: Expression
    public readonly rightOperand: Expression
    constructor(position: Position, operator: Operator, leftOperand: Expression, rightOperand: Expression) {
        super(position)
        this.operator = operator
        this.leftOperand = leftOperand
        this.rightOperand = rightOperand
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export class VariableExpression extends Expression {
    public readonly variable: Variable
    constructor(position: Position, variable: Variable) {
        super(position)
        this.variable = variable
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export class I8LiteralExpression extends Expression {
    public readonly type: Type = Type.i8
    public readonly value: number
    constructor(position: Position, value: number) {
        super(position)
        this.value = value
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export class I16LiteralExpression extends Expression {
    public readonly type: Type = Type.i16
    public readonly value: number
    constructor(position: Position, value: number) {
        super(position)
        this.value = value
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export class I32LiteralExpression extends Expression {
    public readonly type: Type = Type.i32
    public readonly value: number
    constructor(position: Position, value: number) {
        super(position)
        this.value = value
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export class I64LiteralExpression extends Expression {
    public readonly type: Type = Type.i64
    public readonly value: number
    constructor(position: Position, value: number) {
        super(position)
        this.value = value
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export class F32LiteralExpression extends Expression {
    public readonly type: Type = Type.f32
    public readonly value: number
    constructor(position: Position, value: number) {
        super(position)
        this.value = value
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export class F64LiteralExpression extends Expression {
    public readonly type: Type = Type.f64
    public readonly value: number
    constructor(position: Position, value: number) {
        super(position)
        this.value = value
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export class BoolLiteralExpression extends Expression {
    public readonly type: Type = Type.bool
    public readonly value: boolean
    constructor(position: Position, value: boolean) {
        super(position)
        this.value = value
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}

export class StrLiteralExpression extends Expression {
    public readonly type: Type = Type.str
    public readonly value: string
    constructor(position: Position, value: string) {
        super(position)
        this.value = value
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}


export class Variable extends Node {
    public readonly name: string;
    public type: Type;
    constructor(position: Position, name: string, type: Type) {
        super(position)
        this.name = name
        this.type = type
    }
    accept(v: Visitor): void {
        v.visit(this)
    }
}