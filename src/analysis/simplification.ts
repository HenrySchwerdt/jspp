import {
  AssignStatement,
  BinaryExpression,
  DeclarationStatement,
  LiteralExpression,
  Node,
  Operator,
  Program,
  Type,
  Variable,
  VariableExpression,
} from "../representation/ast";
import { EmptyVisitor } from "./symbols";

export class SimplificationPass extends EmptyVisitor {
  lastNode: Node | undefined = undefined;
  isLeft: boolean | undefined = undefined;
  
  pass(ast: Program): void {
    ast.accept(this)
  }

  visitProgram(ctx: Program): void {
    for (let stmt of ctx.body) {
      this.lastNode = stmt;
      stmt.accept(this);
      this.lastNode = stmt;
    }
  }
  visitDeclarationStatement(ctx: DeclarationStatement): void {
    for (let declaration of ctx.declarations) {
      this.lastNode = declaration;
      declaration.accept(this);
      this.lastNode = declaration;
    }
  }
  visitAssignStatement(ctx: AssignStatement): void {
    this.lastNode = ctx;
    ctx.value.accept(this);
    this.lastNode = ctx;
  }
  visitBinaryExpression(ctx: BinaryExpression): void {
    const ref = this.lastNode;
    const isLeft = this.isLeft;
    if (ctx.leftOperand instanceof BinaryExpression) {
      this.lastNode = ctx;
      this.isLeft = true;
      ctx.leftOperand.accept(this);
    }
    if (ctx.rightOperand instanceof BinaryExpression) {
      this.lastNode = ctx;
      this.isLeft = false;
      ctx.rightOperand.accept(this);
    }
    if (
      ctx.leftOperand instanceof LiteralExpression &&
      ctx.rightOperand instanceof LiteralExpression
    ) {
      const a = (ctx.leftOperand as LiteralExpression).value;
      const b = (ctx.rightOperand as LiteralExpression).value;
      let simplified: LiteralExpression | undefined = undefined;
      switch (ctx.operator) {
        case Operator.ADD:
          simplified = new LiteralExpression(ctx.position, Type.i32, a + b);
          break;
        case Operator.SUB:
          simplified = new LiteralExpression(ctx.position, Type.i32, a - b);
          break;
        case Operator.MUL:
          simplified = new LiteralExpression(ctx.position, Type.i32, a * b);
          break;
        case Operator.DIV:
          simplified = new LiteralExpression(
            ctx.position,
            Type.i32,
            Math.floor(a / b)
          );
      }
      if (ref instanceof BinaryExpression) {
        if (isLeft) {
          (ref as BinaryExpression).leftOperand = simplified!;
        } else {
          (ref as BinaryExpression).rightOperand = simplified!;
        }
      }
      if (ref instanceof AssignStatement) {
        (ref as AssignStatement).value = simplified!;
      }
    }
    this.lastNode = this.lastNode;
    this.isLeft = isLeft;
  }
}
