import { BSCompileException } from "../exceptions/exceptions";
import { Type } from "../representation/ast";

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
  public readonly isReferenceParameter: boolean;
  constructor(name: Identifier, type: Type, isReference: boolean) {
    super(name);
    this.type = type;
    this.isReferenceParameter = isReference;
  }
}

export class SymbolTable {
  private readonly entries: Map<Identifier, Info> = new Map();
  private readonly outerScope: SymbolTable | undefined;

  constructor(outerScope: SymbolTable | undefined) {
    this.outerScope = outerScope;
  }

  public lookup(name: Identifier): Info | undefined {
    if (this.entries.has(name)) return this.entries.get(name);
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
    this.entries.set(name, info);
  }

  public enterSave(
    name: Identifier,
    info: Info,
    error: BSCompileException
  ): void {
    if (this.entries.has(name)) {
      throw error;
    }
    this.entries.set(name, info);
  }
}
