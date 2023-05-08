import { BSCompileException } from "../exceptions/exceptions";
import { AssignStatement, BinaryExpression, DeclarationStatement, Operator, Program, VarKind } from "../representation/ast";
import { EmptyVisitor, Identifier, SymbolTable, VariableInfo } from "./symbols";

export class IdentifierPass extends EmptyVisitor {
    private readonly table: SymbolTable = new SymbolTable(undefined)
    private isDeclaration: boolean = false
    private kind: VarKind | undefined = undefined

    pass(ast: Program): void {
        ast.accept(this)
    }

    visitProgram(ctx: Program): void {
        for (let stmt of ctx.body) {
            stmt.accept(this);
        }
    }
    visitDeclarationStatement(ctx: DeclarationStatement): void {
        for (let declaration of ctx.declarations) {
            this.isDeclaration = true
            this.kind = ctx.kind
            declaration.accept(this);
            this.isDeclaration = false
            this.kind = undefined
        }
    }
    visitAssignStatement(ctx: AssignStatement): void {
        if (this.isDeclaration) {
            const ident = new Identifier(ctx.target.name)
            const info = new VariableInfo(ident, ctx.target.type, this.kind!, false)
            this.table.enterSave(ident, info, new BSCompileException(`Error: Cannot declare a variable with the same name, var '${ident.identifier}' already exists.`,
                ctx.target,
                ctx.target.position.file
            ))
        } else {
            const ident = new Identifier(ctx.target.name)
            const info = this.table.lookupSave(ident, new BSCompileException(`Error: The variable you try to assign is not declared.`,
                ctx.target,
                ctx.target.position.file
            )) as VariableInfo
            if (info.kind == VarKind.const) {
                throw new BSCompileException(`Error: Try to reassign a const value.`, ctx.target,
                    ctx.target.position.file)
            }
        }
    }

}