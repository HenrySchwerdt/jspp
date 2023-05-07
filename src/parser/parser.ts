import { BSParseException } from "../exceptions/exceptions";
import { AssignStatement, BinaryExpression, DeclarationStatement, Expression, I32LiteralExpression, Operator, Program, Statement, Type, VarKind, Variable, VariableExpression } from "../representation/ast";
import { Position, Token, TokenType } from "./token";

export class Parser {
    private readonly tokens: Token[]
    private cursor: number = 0
    constructor(tokens: Token[]) {
        this.tokens = tokens
    }
    private peek(): Token {
        if (this.cursor >= this.tokens.length) {
            return this.tokens[this.tokens.length - 1]
        }
        return this.tokens[this.cursor]
    }
    private npeek(n: number): Token {
        if (this.cursor + n >= this.tokens.length) {
            return this.tokens[this.tokens.length - 1]
        }
        return this.tokens[this.cursor + n]
    }
    private consume(): Token {
        if (this.cursor >= this.tokens.length) {
            return this.tokens[this.tokens.length - 1]
        }
        return this.tokens[this.cursor++]
    }
    private variable(): Variable {
        const ident = this.consume()
        return new Variable(ident.position, ident.value, Type.unknown)
    }
    private variableExpression(): VariableExpression {
        return new VariableExpression(this.peek().position, this.variable())
    }

    private factor(): Expression {
        if (this.peek().type == TokenType.TK_NUMBER) {
            const token = this.consume()
            return new I32LiteralExpression(token.position, parseInt(token.value))
        } else if (this.peek().type == TokenType.TK_IDENTIFIER) {
            return this.variableExpression()
        }
        throw new BSParseException(`Expeceted a variable or a literal, but got '${this.peek().value}'`,
            this.peek(),
            this.peek().position.file
        )
    }

    private term(): Expression {
        const pos = this.peek().position
        if ([TokenType.TK_STAR, TokenType.TK_SLASH].includes(this.npeek(1).type)) {
            const left = this.factor()
            const operator = this.consume().type == TokenType.TK_STAR ? Operator.MUL : Operator.DIV;
            const right = this.factor()
            return new BinaryExpression(pos, operator, left, right)
        }
        return this.factor()
    }

    private expression(): Expression {
        const pos = this.peek().position
        if ([TokenType.TK_PLUS, TokenType.TK_MINUS, TokenType.TK_STAR, TokenType.TK_SLASH].includes(this.npeek(1).type)) {
            // Binary Expression
            const left = this.term()
            const operator = this.consume().type == TokenType.TK_PLUS ? Operator.ADD : Operator.SUB;
            const right = this.expression()
            return new BinaryExpression(pos, operator, left, right)

        } else {
            return this.term()
        }
    }

    private declarationStmt(): DeclarationStatement {
        const position: Position = this.peek().position
        const kind: VarKind = this.consume().type == TokenType.TK_LET ? VarKind.let : VarKind.const
        const declarations: AssignStatement[] = [this.assignmentStmt()]
        while (this.peek().type == TokenType.TK_COMMA) {
            this.consume()
            declarations.push(this.assignmentStmt())
        }
        return new DeclarationStatement(position, kind, declarations)
    }

    private assignmentStmt(): AssignStatement {
        const position: Position = this.peek().position
        const variable: Variable = this.variable()
        if (this.peek().type == TokenType.TK_COLON) {
            this.consume()
            const varType = this.consume()
            switch (varType.type) {
                case TokenType.TK_I8:
                    variable.type = Type.i8
                    break
                case TokenType.TK_I16:
                    variable.type = Type.i16
                    break
                case TokenType.TK_I32:
                    variable.type = Type.i32
                    break
                case TokenType.TK_I64:
                    variable.type = Type.i64
                    break
                case TokenType.TK_F32:
                    variable.type = Type.f32
                    break
                case TokenType.TK_F64:
                    variable.type = Type.f64
                    break
                // TODO bool str
                default:
                    throw new BSParseException(`Expected 'type' after ':', but got ${varType.value}`,
                        varType, varType.position.file)
            }

        }
        if (this.peek().type != TokenType.TK_EQUAL) {
            throw new BSParseException(`Expected '=' after variable assignment, but got ${this.peek().value}.`,
                this.peek(),
                this.peek().position.file)
        }
        this.consume()
        const value: Expression = this.expression()
        return new AssignStatement(position, variable, value)
    }

    private stmt(): Statement {
        if (this.peek().type == TokenType.TK_LET || this.peek().type == TokenType.TK_CONST) {
            return this.declarationStmt()
        } else if (this.peek().type == TokenType.TK_IDENTIFIER) {
            return this.assignmentStmt()
        } else {
            throw new BSParseException(`Expected a statment but got '${this.peek().value}'`,
                this.peek(),
                this.peek().position.file)
        }
    }

    private program(): Program {
        const body: Statement[] = []
        const startPos = this.peek().position
        while (this.peek().type != TokenType.TK_EOF) {
            body.push(this.stmt())
        }
        return new Program(startPos, body)
    }

    public parse(): Program {
        return this.program()
    }
}