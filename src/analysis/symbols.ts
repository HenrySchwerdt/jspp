import { BSCompileException } from "../exceptions/exceptions";
import { AssignStatement, BinaryExpression, BoolLiteralExpression, DeclarationStatement, F32LiteralExpression, F64LiteralExpression, I16LiteralExpression, I32LiteralExpression, I64LiteralExpression, I8LiteralExpression, Program, StrLiteralExpression, Type, VarKind, Variable, VariableExpression, Visitor } from "../representation/ast";

export class EmptyVisitor extends Visitor {

  visitProgram(ctx: Program): void {
  }
  visitDeclarationStatement(ctx: DeclarationStatement): void {
  }
  visitAssignStatement(ctx: AssignStatement): void {
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
  
}

export class Identifier {
  public readonly identifier: string;

  constructor(identifier: string) {
    this.identifier = identifier;
  }
}

export abstract class Info {
  public readonly name: Identifier;
  constructor(name: Identifier) {
    this.name = name;
  }
}

export class VariableInfo extends Info {
  public readonly type: Type;
  public readonly kind: VarKind;
  public readonly isReferenceParameter: boolean;
  constructor(name: Identifier, type: Type, kind: VarKind, isReference: boolean) {
    super(name);
    this.type = type;
    this.kind = kind;
    this.isReferenceParameter = isReference;
  }
}

export class SymbolTable {
  private readonly entries: Map<string, Info> = new Map();
  private readonly outerScope: SymbolTable | undefined;

  constructor(outerScope: SymbolTable | undefined) {
    this.outerScope = outerScope;
  }

  public lookup(name: Identifier): Info | undefined {
    if (this.entries.has(name.identifier)) return this.entries.get(name.identifier);
    else {
      if (this.outerScope) return this.outerScope.lookup(name);
      else return undefined;
    }
  }

  public lookupSave(name: Identifier, error: BSCompileException): Info {
    const info = this.lookup(name);
    if (info) {
      return info;
    }
    throw error;
  }

  public enter(name: Identifier, info: Info): void {
    this.entries.set(name.identifier, info);
  }

  public enterSave(
    name: Identifier,
    info: Info,
    error: BSCompileException
  ): void {
    if (this.entries.has(name.identifier)) {
      throw error;
    }
    this.entries.set(name.identifier, info);
  }
}