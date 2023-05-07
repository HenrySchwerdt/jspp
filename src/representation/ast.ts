import { Position } from "../parser/token";

export enum Operator {
  ADD,
  SUB,
  MUL,
  DIV,
  EQU,
  NEQ,
  LST,
  LSE,
  GRT,
  GRE,
}

export enum Type {
  i8,
  i16,
  i32,
  i64,
  f32,
  f64,
  str,
  bool,
  unknown,
}

export enum VarKind {
  let,
  const,
}

export function isArithmetic(op: Operator): boolean {
  return [Operator.ADD, Operator.SUB, Operator.MUL, Operator.DIV].includes(op);
}

export function isComparison(op: Operator): boolean {
  return !isArithmetic(op);
}

export abstract class Visitor {
  abstract visitProgram(ctx: Program): void;
  abstract visitDeclarationStatement(ctx: DeclarationStatement): void;
  abstract visitAssignStatement(ctx: AssignStatement): void;
  abstract visitBinaryExpression(ctx: BinaryExpression): void;
  abstract visitVariableExpression(ctx: VariableExpression): void;
  abstract visitI8LiteralExpression(ctx: I8LiteralExpression): void;
  abstract visitI16LiteralExpression(ctx: I16LiteralExpression): void;
  abstract visitI32LiteralExpression(ctx: I32LiteralExpression): void;
  abstract visitI64LiteralExpression(ctx: I64LiteralExpression): void;
  abstract visitStrLiteralExpression(ctx: StrLiteralExpression): void;
  abstract visitBoolLiteralExpression(ctx: BoolLiteralExpression): void;
  abstract visitF32LiteralExpression(ctx: F32LiteralExpression): void;
  abstract visitF64LiteralExpression(ctx: F64LiteralExpression): void;
  abstract visitVariable(ctx: Variable): void;
}

export abstract class Node {
  public position: Position;

  constructor(position: Position) {
    this.position = position;
  }
  abstract accept(v: Visitor): void;
}

export class Program extends Node {
  body: Statement[];
  constructor(position: Position, body: Statement[]) {
    super(position);
    this.body = body;
  }
  accept(v: Visitor): void {
    v.visitProgram(this);
  }
}

export abstract class Statement extends Node {
  constructor(position: Position) {
    super(position);
  }
}

export class DeclarationStatement extends Statement {
  public kind: VarKind;
  public declarations: AssignStatement[];
  constructor(
    position: Position,
    kind: VarKind,
    declarations: AssignStatement[]
  ) {
    super(position);
    this.kind = kind;
    this.declarations = declarations;
  }
  accept(v: Visitor): void {
    v.visitDeclarationStatement(this);
  }
}

export class AssignStatement extends Statement {
  public target: Variable;
  public value: Expression;
  constructor(position: Position, target: Variable, value: Expression) {
    super(position);
    this.target = target;
    this.value = value;
  }
  accept(v: Visitor): void {
    v.visitAssignStatement(this);
  }
}

export abstract class Expression extends Node {
  public dataType: Type = Type.unknown;
  constructor(position: Position) {
    super(position);
  }
}

export class BinaryExpression extends Expression {
  public operator: Operator;
  public leftOperand: Expression;
  public rightOperand: Expression;
  constructor(
    position: Position,
    operator: Operator,
    leftOperand: Expression,
    rightOperand: Expression
  ) {
    super(position);
    this.operator = operator;
    this.leftOperand = leftOperand;
    this.rightOperand = rightOperand;
  }
  accept(v: Visitor): void {
    v.visitBinaryExpression(this);
  }
}

export class VariableExpression extends Expression {
  public variable: Variable;
  constructor(position: Position, variable: Variable) {
    super(position);
    this.variable = variable;
  }
  accept(v: Visitor): void {
    v.visitVariableExpression(this);
  }
}

export class I8LiteralExpression extends Expression {
  public type: Type = Type.i8;
  public value: number;
  constructor(position: Position, value: number) {
    super(position);
    this.value = value;
  }
  accept(v: Visitor): void {
    v.visitI8LiteralExpression(this);
  }
}

export class I16LiteralExpression extends Expression {
  public type: Type = Type.i16;
  public value: number;
  constructor(position: Position, value: number) {
    super(position);
    this.value = value;
  }
  accept(v: Visitor): void {
    v.visitI16LiteralExpression(this);
  }
}

export class I32LiteralExpression extends Expression {
  public type: Type = Type.i32;
  public value: number;
  constructor(position: Position, value: number) {
    super(position);
    this.value = value;
  }
  accept(v: Visitor): void {
    v.visitI32LiteralExpression(this);
  }
}

export class I64LiteralExpression extends Expression {
  public type: Type = Type.i64;
  public value: number;
  constructor(position: Position, value: number) {
    super(position);
    this.value = value;
  }
  accept(v: Visitor): void {
    v.visitI64LiteralExpression(this);
  }
}

export class F32LiteralExpression extends Expression {
  public type: Type = Type.f32;
  public value: number;
  constructor(position: Position, value: number) {
    super(position);
    this.value = value;
  }
  accept(v: Visitor): void {
    v.visitF32LiteralExpression(this);
  }
}

export class F64LiteralExpression extends Expression {
  public type: Type = Type.f64;
  public value: number;
  constructor(position: Position, value: number) {
    super(position);
    this.value = value;
  }
  accept(v: Visitor): void {
    v.visitF64LiteralExpression(this);
  }
}

export class BoolLiteralExpression extends Expression {
  public type: Type = Type.bool;
  public value: boolean;
  constructor(position: Position, value: boolean) {
    super(position);
    this.value = value;
  }
  accept(v: Visitor): void {
    v.visitBoolLiteralExpression(this);
  }
}

export class StrLiteralExpression extends Expression {
  public type: Type = Type.str;
  public value: string;
  constructor(position: Position, value: string) {
    super(position);
    this.value = value;
  }
  accept(v: Visitor): void {
    v.visitStrLiteralExpression(this);
  }
}

export class Variable extends Node {
  public name: string;
  public type: Type;
  constructor(position: Position, name: string, type: Type) {
    super(position);
    this.name = name;
    this.type = type;
  }
  accept(v: Visitor): void {
    v.visitVariable(this);
  }
}
