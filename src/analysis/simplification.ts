import {
  AssignStatement,
  BinaryExpression,
  BoolLiteralExpression,
  DeclarationStatement,
  F32LiteralExpression,
  F64LiteralExpression,
  I16LiteralExpression,
  I32LiteralExpression,
  I64LiteralExpression,
  I8LiteralExpression,
  Node,
  Operator,
  Program,
  StrLiteralExpression,
  Variable,
  VariableExpression,
} from "../representation/ast";
import { EmptyVisitor } from "./symbols";

export class SimplificationPass extends EmptyVisitor {
  lastNode: Node | undefined = undefined;
  isLeft: boolean | undefined = undefined;
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
      ctx.leftOperand instanceof I32LiteralExpression &&
      ctx.rightOperand instanceof I32LiteralExpression
    ) {
      const a = (ctx.leftOperand as I32LiteralExpression).value;
      const b = (ctx.rightOperand as I32LiteralExpression).value;
      let simplified: I32LiteralExpression | undefined = undefined;
      switch (ctx.operator) {
        case Operator.ADD:
          simplified = new I32LiteralExpression(ctx.position, a + b);
          break;
        case Operator.SUB:
          simplified = new I32LiteralExpression(ctx.position, a - b);
          break;
        case Operator.MUL:
          simplified = new I32LiteralExpression(ctx.position, a * b);
          break;
        case Operator.DIV:
          simplified = new I32LiteralExpression(
            ctx.position,
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
  visitVariableExpression(ctx: VariableExpression): void {}
  visitI8LiteralExpression(ctx: I8LiteralExpression): void {}
  visitI16LiteralExpression(ctx: I16LiteralExpression): void {}
  visitI32LiteralExpression(ctx: I32LiteralExpression): void {}
  visitI64LiteralExpression(ctx: I64LiteralExpression): void {}
  visitStrLiteralExpression(ctx: StrLiteralExpression): void {}
  visitBoolLiteralExpression(ctx: BoolLiteralExpression): void {}
  visitF32LiteralExpression(ctx: F32LiteralExpression): void {}
  visitF64LiteralExpression(ctx: F64LiteralExpression): void {}
  visitVariable(ctx: Variable): void {}
}
