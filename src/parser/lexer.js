const fs = require("fs")
const { TK_DOT, TK_PLUS, TK_MINUS, TK_ERROR, TK_NUMBER, TK_EOF, Token } = require("./token");
const { UnexpectedTokenError } = require("./parsingErrors");

module.exports = class Lexer {
    constructor(entryPoint) {
        this.entryPoint = entryPoint;
        this.fileContent = fs.readFileSync(entryPoint).toString()
        this.cursor = 0;
        this.row = 1;
        this.col = 1;
    }
    _isEOF() {
        return this.fileContent.length <= this.cursor
    }
    _peek() {
        return this.fileContent[this.cursor]
    }
    _consume() {
        const char = this.fileContent[this.cursor]
        this.cursor++
        if (char == '\n') {
            this.row++
            this.col = 1
        } else {
            this.col++
        }
        return char
    }
    _isNumeric() {
        return /^\d+$/.test(this._peek())
    }

    _skipCommentsAndBlanc() {
        const ignoredCharacters = [' ', '\t', '\r', '\n'].join()
        while(!this._isEOF() && ignoredCharacters.includes(this._peek())) {
            this._consume()
        }
    }

    _number() {
        let number = ""
        const startCol = this.col
        while(!this._isEOF() && this._isNumeric()) {
            number += this._consume()
        }
        return new Token(this.entryPoint, this.row, startCol, TK_NUMBER, number)
    }

    _sdtokens() {
        const startCol = this.col
        const char = this._consume()
        switch (char) {
            case '.': {
                return new Token(this.entryPoint, this.row, startCol, TK_DOT, char)
            }
            case '+': {
                return new Token(this.entryPoint, this.row, startCol, TK_PLUS, char)
            }
            case '-': {
                return new Token(this.entryPoint, this.row, startCol, TK_MINUS, char)
            }
            default: {
                const errorToken = new Token(this.entryPoint, this.row, startCol, TK_ERROR, char)
                throw new UnexpectedTokenError(errorToken, this.entryPoint, this.fileContent)
            }
        }
    }

    tokenize() {
        const tokens = []
        while(!this._isEOF()) {
            this._skipCommentsAndBlanc()
            if (this._isNumeric()) {
                tokens.push(this._number())
            } else {
                tokens.push(this._sdtokens())
            }
        }
        tokens.push(new Token(this.entryPoint, this.row, this.col, TK_EOF, "\0"))
        return tokens
    }
}