import { BSCompileException } from "../exceptions/exceptions";
import { AssignStatement, BinaryExpression, CallExpression, CallStatement, DeclarationStatement, FnDeclaration, LiteralExpression, Program, Type, VarKind, Variable, VariableExpression, Visitor } from "../representation/ast";

export class EmptyVisitor extends Visitor {
  visitCallExpression(ctx: CallExpression): void {
  }
  visitCallStatement(ctx: CallStatement): void {
  }
  visitFnDeclaration(ctx: FnDeclaration): void {
  }
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
  visitLiteralExpression(ctx: LiteralExpression): void {
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
