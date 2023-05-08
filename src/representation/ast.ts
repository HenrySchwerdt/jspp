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
  abstract visitFnDeclaration(ctx: FnDeclaration): void;
  abstract visitProgram(ctx: Program): void;
  abstract visitDeclarationStatement(ctx: DeclarationStatement): void;
  abstract visitAssignStatement(ctx: AssignStatement): void;
  abstract visitBinaryExpression(ctx: BinaryExpression): void;
  abstract visitVariableExpression(ctx: VariableExpression): void;
  abstract visitLiteralExpression(ctx: LiteralExpression): void;
  abstract visitVariable(ctx: Variable): void;
  abstract visitCallExpression(ctx: CallExpression): void;
  abstract visitCallStatement(ctx: CallStatement): void;
  abstract visitIfStatement(ctx: IfStatement): void;
  abstract visitBlockStatement(ctx: BlockStatement): void;
  abstract visitWhileStatement(ctx: WhileStatement): void;
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


export class FnDeclaration extends Statement {
    public returnType: Type
    public name: string
    public paramter: Variable[]
    public body: Statement[]
    constructor(position: Position, name: string, parameter: Variable[], body: Statement[], returnType: Type) {
        super(position)
        this.name = name
        this.paramter = parameter
        this.body = body
        this.returnType = returnType
    }

    accept(v: Visitor): void {
        v.visitFnDeclaration(this)
    }
}
export class CallStatement extends Statement {
    public callExpression: CallExpression
    constructor(position: Position, callExpression: CallExpression) {
        super(position)
        this.callExpression = callExpression
    }
    accept(v: Visitor): void {
        v.visitCallStatement(this)
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
export class BlockStatement extends Statement {
  public body: Statement[]
  constructor(position: Position, body: Statement[]) {
    super(position)
    this.body = body
  }
  accept(v: Visitor): void {
    v.visitBlockStatement(this)
  }
}
export class WhileStatement extends Statement {
 
  public condition: Expression
  public body: BlockStatement
  constructor(position: Position, condition: Expression, body: BlockStatement) {
    super(position)
    this.condition = condition
    this.body = body
  }
  accept(v: Visitor): void {
    v.visitWhileStatement(this)
  }
}

export class IfStatement extends Statement {
  public condition: Expression
  public consequent: BlockStatement
  public alternate: BlockStatement | undefined
  constructor(position: Position, condition: Expression, consequent: BlockStatement, alternate: BlockStatement | undefined) {
    super(position)
    this.condition = condition
    this.consequent = consequent
    this.alternate = alternate
  }
  accept(v: Visitor): void {
    v.visitIfStatement(this)
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

export class CallExpression extends Expression {
    public name: string
    public paramters: Expression[]
    constructor(position: Position, name: string, parameters: Expression[]) {
        super(position)
        this.name = name
        this.paramters = parameters
    }

    accept(v: Visitor): void {
       v.visitCallExpression(this)
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

export class LiteralExpression extends Expression {

  public type: Type
  public value: any
  constructor(position: Position, type: Type, value: any) {
    super(position)
    this.type = type
    this.value = value
  }

  accept(v: Visitor): void {
    v.visitLiteralExpression(this)
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
