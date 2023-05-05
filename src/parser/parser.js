const Lexer = require("./lexer")
const ops = require("../opCodes");
const { TK_EOF, TK_DOT, TK_NUMBER, TK_PLUS, TK_MINUS, TK_EQUAL, TK_LET, TK_IDENTIFIER, TK_COLON, TK_I32, TK_COMMA, TK_OPAREN, TK_SLASH, TK_STAR, TK_CPAREN } = require("./token");
const { GrammarError } = require("./parsingErrors");
const { Program, Identifier, Literal, VariableDeclarator, VariableDeclaration, ExpressionStatement, BinaryExpression, AssigmentExpression, CallExpression } = require("../representation/ast");
module.exports = class Parser {

    constructor(entrypoint) {
        this.entrypoint = entrypoint
        this.lexer = new Lexer(entrypoint)
        this.tokens = this.lexer.tokenize()
        this.cursor = 0
    }
    _peek() {
        if (this.cursor >= this.tokens.length) {
            return this.tokens[this.tokens.length - 1]
        }
        return this.tokens[this.cursor]
    }
    _npeek(n) {
        if (this.cursor+n >= this.tokens.length) {
            return this.tokens[this.tokens.length - 1]
        }
        return this.tokens[this.cursor+n]
    }
    _consume() {
        if (this.cursor >= this.tokens.length) {
            return this.tokens[this.tokens.length - 1]
        }
        return this.tokens[this.cursor++]
    }

    _literal(ofType) {
        const literal = this._peek()
        if (literal.type == TK_NUMBER) {
            this._consume()
            return new Literal(literal.cursor - literal.value.length,
                literal.cursor,
                parseInt(literal.value),
                literal.value,
                ofType || 'i32')
        } else {
            return this._identifer()
        }
        
    }

    _identifer() {
        const ident = this._consume()
        return new Identifier(ident.cursor - ident.value.length,
             ident.cursor,
            ident.value)
    }

    _variableDeclarator() {
        const start = this._peek().cursor
        const identifier = this._identifer()
        let valueType = undefined
        if (this._peek().type == TK_COLON) {
            this._consume()
            const vTypeToken = this._consume()
            if (vTypeToken.type != TK_I32) {
                throw new GrammarError(`Expected type after ':', but got '${vTypeToken.value}'.`,
                    vTypeToken,
                    this.lexer.entryPoint,
                    this.lexer.fileContent
                )
            }
            valueType = vTypeToken.value
        }
        const equal = this._consume()
        if (equal.type != TK_EQUAL) {
            throw new GrammarError(`Expected '=' after identifier, but got '${equal.value}'.`,
                equal,
                this.lexer.entryPoint,
                this.lexer.fileContent
            )
        }
        const literal = this._expression()
        return new VariableDeclarator(start, literal.end, identifier, literal)
    }

    _variableDeclaration() {
        const start = this._peek().cursor
        const kind = this._consume().value
        const declarations = []
        if (this._peek().type != TK_IDENTIFIER) {
            throw new GrammarError(`Expected identifier after '${kind}', but got ${this._peek().value}.`,
                this._peek(),
                this.lexer.entryPoint,
                this.lexer.fileContent
            )
        }
        declarations.push(this._variableDeclarator())
        while(this._peek().type == TK_COMMA) {
            this._consume()
            declarations.push(this._variableDeclarator())
        }
        const end = declarations[declarations.length -1].end
        return new VariableDeclaration(start, end, declarations)
    }
    _parameter() {
        const parameters = []
        parameters.push(this._expression())
        while(this._peek().type == TK_COMMA) {
            this._consume()
            parameters.push(this._expression())
        }
        return parameters
    }

    _callExpression() {
        // Currently only support for print
        const start = this._peek().cursor
        const functionName = this._identifer()
        this._consume()
        if (this._peek().type== TK_CPAREN) {
            const end = this._peek().cursor
            this._consume()
            return new CallExpression(start, end, functionName, null)
        }
        const paramter = this._parameter()
        this._consume()
        const end = this._peek().cursor
        return new CallExpression(start, end, functionName, paramter)
    }

    _assignmentExpression() {
        const start = this._peek().cursor
        const left = this._identifer()
        const op = this._consume().value
        const right = this._expression()
        const end = this._peek().cursor
        return new AssigmentExpression(start, end, op, left, right)
    }

    _factor() {
        return this._literal()
    }

    _term() {
        const start = this._peek().cursor
        const left = this._factor()
        if (this._peek().type == TK_SLASH || this._peek().type == TK_STAR) {
            const operator = this._consume().value
            const right = this._term()
            const end = this._peek().cursor
            return new BinaryExpression(start, end, left, operator, right)
        }
        return left
    }
    
    _binaryExpression() {
        const start = this._peek().cursor
        const left = this._term()
        if (this._peek().type == TK_PLUS || this._peek().type == TK_MINUS) {
            const operator = this._consume().value
            const right = this._binaryExpression()
            const end = this._peek().cursor
            return new BinaryExpression(start, end, left, operator, right)
        }
        return left
    }

    _expression() {
        if (this._npeek(1).type == TK_OPAREN) {
            return this._callExpression()
        } else if (this._npeek(1).type == TK_EQUAL) {
            return this._assignmentExpression()
        }
        return this._binaryExpression()
    }

    _expressionStmt() {
        const start = this._peek().cursor
        const expression = this._expression()
        const end = this._peek().cursor
        return new ExpressionStatement(start, end, expression)
    }

    _stmt() {
        if (this._peek().type == TK_LET) {
            return this._variableDeclaration()
        }
        return this._expressionStmt()
    }
    
    _program() {
        const body = []
        const start = this._peek().cursor
        while(this._peek().type != TK_EOF) {
            body.push(this._stmt())
        }
        return new Program(start, this._peek().cursor, body)
    }

    parse() {
        return this._program()
    }
}
