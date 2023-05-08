import { BSParseException } from "../exceptions/exceptions";
import { AssignStatement, BinaryExpression, BlockStatement, CallExpression, CallStatement, DeclarationStatement, Expression, IfStatement, LiteralExpression, Operator, Program, Statement, Type, VarKind, Variable, VariableExpression, WhileStatement } from "../representation/ast";
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
    private match(type: TokenType, expected: string) {
        if (this.peek().type == type) {
            this.consume()
        } else {
            throw new BSParseException(`Expected '${expected}' after variable assignment, but got ${this.peek().value}.`,
                this.peek(),
                this.peek().position.file) 
        }
    }
    private variable(): Variable {
        const ident = this.consume()
        return new Variable(ident.position, ident.value, Type.unknown)
    }
    private variableExpression(): VariableExpression {
        return new VariableExpression(this.peek().position, this.variable())
    }

    private factor(): Expression {
        if (this.peek().type == TokenType.TK_OPAREN) {
            this.consume()
            const expr = this.expression()
            if (this.peek().type != TokenType.TK_CPAREN) {
                throw new BSParseException(`Expected ')' after variable assignment, but got ${this.peek().value}.`,
                this.peek(),
                this.peek().position.file)
            }
            this.consume()
            return expr
        }
        
        if (this.peek().type == TokenType.TK_NUMBER) {
            const token = this.consume()
            return new LiteralExpression(token.position, Type.i32, parseInt(token.value))
        } else if (this.peek().type == TokenType.TK_IDENTIFIER) {
            return this.variableExpression()
        }
        throw new BSParseException(`Expeceted a variable or a literal, but got '${this.peek().value}'`,
            this.peek(),
            this.peek().position.file
        )
    }

    private term(): Expression {
        let left = this.factor()
        while([TokenType.TK_STAR, TokenType.TK_SLASH].includes(this.peek().type)) {
            const operator = this.consume().type == TokenType.TK_STAR ? Operator.MUL : Operator.DIV;
            const right = this.factor()
            left = new BinaryExpression(left.position, operator, left, right)
        }
        return left
    }
    
    private comp(): Expression {
        let left = this.term()
        while([TokenType.TK_EQUAL_EQUAL, TokenType.TK_GT, TokenType.TK_GTE, TokenType.TK_LS, TokenType.TK_LSE].includes(this.peek().type)) {
            let operator: Operator | undefined = undefined
            switch(this.consume().type) {
                case TokenType.TK_EQUAL_EQUAL:
                    operator = Operator.EQU
                    break
                case TokenType.TK_GT:
                    operator = Operator.GRT
                    break
                case TokenType.TK_GTE:
                    operator = Operator.GRE
                    break
                case TokenType.TK_LS:
                    operator = Operator.LST
                    break
                case TokenType.TK_LSE:
                    operator = Operator.LSE
                    break
            }
            const right = this.term()
            left= new BinaryExpression(left.position, operator!, left, right)
        }
        return left
    }

    private expression(): Expression {
        let left = this.comp()
        while([TokenType.TK_PLUS, TokenType.TK_MINUS].includes(this.peek().type)) {
            const operator = this.consume().type == TokenType.TK_PLUS ? Operator.ADD : Operator.SUB;
            const right = this.comp()
            left = new BinaryExpression(left.position, operator, left, right) 
        }
        return left
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
    private callExpression() {
        const startPos = this.peek().position
        const name = this.consume()
        this.consume()
        if (this.peek().type == TokenType.TK_CPAREN) {
            this.consume()
            return new CallExpression(startPos, name.value, [])
        }
        const parameter = [this.expression()]
        while(this.peek().type == TokenType.TK_COMMA) {
            parameter.push(this.expression())
        }
        this.consume()
        return new CallExpression(startPos, name.value, parameter)
    }
    private callStmt() {
        const startPos = this.peek().position
        const callExpression = this.callExpression()
        return new CallStatement(startPos, callExpression)
    }
    private blockStmt(): BlockStatement {
        const openBrace = this.consume()
        const body = []
        while(this.peek().type != TokenType.TK_CBRACE) {
            body.push(this.stmt())
        }
        this.consume()
        return new BlockStatement(openBrace.position, body)
    }

    private ifStmt(): IfStatement {
        const ifTk = this.consume()
        this.match(TokenType.TK_OPAREN, '(')
        const condition = this.expression()
        this.match(TokenType.TK_CPAREN, ')')
        const consequent = this.blockStmt()
        let alternate: BlockStatement | undefined = undefined
        if (this.peek().type == TokenType.TK_ELSE) {
            this.consume()
            alternate = this.blockStmt()
        }
        return new IfStatement(ifTk.position, condition, consequent, alternate)
    }

    private whileStmt(): WhileStatement {
        const whileTk = this.consume()
        this.match(TokenType.TK_OPAREN, '(')
        const condition = this.expression()
        this.match(TokenType.TK_CPAREN, ')')
        const body = this.blockStmt()
        return new WhileStatement(whileTk.position, condition, body)
    }

    private stmt(): Statement {
        if (this.peek().type == TokenType.TK_LET || this.peek().type == TokenType.TK_CONST) {
            return this.declarationStmt()
        } else if (this.peek().type == TokenType.TK_IDENTIFIER && this.npeek(1).type == TokenType.TK_OPAREN) {
            return this.callStmt()
        } else if (this.peek().type == TokenType.TK_IDENTIFIER) {
            return this.assignmentStmt()
        } else if (this.peek().type == TokenType.TK_IF) {
            return this.ifStmt()
        } else if (this.peek().type == TokenType.TK_WHILE) {
            return this.whileStmt()
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