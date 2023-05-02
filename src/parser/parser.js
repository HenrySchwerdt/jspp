const Lexer = require("./lexer")
const ops = require("../opCodes");
const { TK_EOF, TK_DOT, TK_NUMBER, TK_PLUS, TK_MINUS } = require("./token");
const { GrammarError } = require("./parsingErrors");
module.exports = class Parser {
    
    constructor(entrypoint) {
        this.entrypoint = entrypoint
        this.lexer = new Lexer(entrypoint)
        this.tokens = this.lexer.tokenize()
        this.cursor = 0
    }
    _peek() {
        if (this.cursor >= this.tokens.length) {
            return this.tokens[this.tokens.length -1]
        }
        return this.tokens[this.cursor]
    }
    _consume() {
        if (this.cursor >= this.tokens.length) {
            return this.tokens[this.tokens.length -1]
        }
        return this.tokens[this.cursor++]
    }
    _number(program) {
        const numberToken = this._consume()
        if (numberToken.type == TK_NUMBER) {
            program.push(ops.push(parseInt(numberToken.value)))
        } else {
            throw new GrammarError(`Expected Number but got '${numberToken.value}'`,
                numberToken,
                this.lexer.entryPoint,
                this.lexer.fileContent
            )
        }
        
    }
    _binaryExpr(program) {
        this._number(program)
        if (this._peek().type == TK_MINUS || this._peek().type == TK_PLUS) {
            let op = this._consume()
            if (this._peek().type == TK_NUMBER) {
                this._number(program)
                if (op.type == TK_MINUS) {
                    program.push(ops.minus())
                } else {
                    program.push(ops.plus())
                }
            } else {
                throw new GrammarError(`Expected Number but got '${this._peek().value}'`,
                op,
                this.lexer.entryPoint,
                this.lexer.fileContent
            )
            }
           
        }
    }
    _dumpExpr(program) {
        program.push(ops.dump())
        this._consume()
    }
    _expr(program) {
        if (this._peek().type == TK_DOT) {
            this._dumpExpr(program)
        } else if (this._peek().type == TK_NUMBER) {
            this._binaryExpr(program)
        } else {
            throw new GrammarError(`Expected Expression but got '${this._peek().value}'`,
                this._peek(),
                this.lexer.entryPoint,
                this.lexer.fileContent
            )
        }
    }

    parse() {
        const program = []
        while(this._peek().type != TK_EOF) {
            this._expr(program)
        }
        return program
    }
}
