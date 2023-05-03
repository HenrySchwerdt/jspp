const fs = require("fs")
const { TK_DOT, TK_PLUS, TK_MINUS, TK_ERROR, TK_NUMBER, TK_EOF, Token, TK_EQUAL, TK_IDENTIFIER, TK_LET, TK_I32, TK_COLON, TK_COMMA, TK_PRINT, TK_SLASH, TK_STAR, TK_OPAREN, TK_CPAREN } = require("./token");
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
    _npeek(n) {
        let word = ""
        for (let i = this.cursor; i < this.cursor + n; i++) {
            if (i >= this.fileContent.length) {
                word += "null"
            } else {
                word += this.fileContent[i]
            }
        }
        return word
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
    
    _isAlpha() {
        return /^[a-zA-Z]*$/.test(this._peek())
    }

    _skipCommentsAndBlanc() {
        const ignoredCharacters = [' ', '\t', '\r', '\n'].join("")
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
        return new Token(this.entryPoint, this.row, startCol, TK_NUMBER, number, this.cursor)
    }
    _keyword() {
        const keywords = [['let', TK_LET], ['i32', TK_I32]]
        const startCol = this.col
        for (let keyword of keywords) {
            const currentWord = this._npeek(keyword[0].length)
            if (currentWord == keyword[0]) {
                for(let i = 0; i<keyword[0].length; i++) {
                    this._consume()
                } 
                return new Token(this.entryPoint, this.row, startCol, keyword[1], currentWord, this.cursor)
            }
        }
        return this._identifier()
    }
    _identifier() {
        let identifier = ""
        const startCol = this.col
        while(!this._isEOF() && (this._isNumeric() || this._isAlpha())) {
            identifier += this._consume()
        }
        return new Token(this.entryPoint, this.row, startCol, TK_IDENTIFIER, identifier, this.cursor)
    }

    _sdtokens() {
        const startCol = this.col
        const char = this._consume()
        switch (char) {
            case '.': {
                return new Token(this.entryPoint, this.row, startCol, TK_DOT, char, this.cursor)
            }
            case '+': {
                return new Token(this.entryPoint, this.row, startCol, TK_PLUS, char, this.cursor)
            }
            case '-': {
                return new Token(this.entryPoint, this.row, startCol, TK_MINUS, char, this.cursor)
            }
            case '/': {
                return new Token(this.entryPoint, this.row, startCol, TK_SLASH, char, this.cursor)
            }
            case '(': {
                return new Token(this.entryPoint, this.row, startCol, TK_OPAREN, char, this.cursor)
            }
            case ')': {
                return new Token(this.entryPoint, this.row, startCol, TK_CPAREN, char, this.cursor)
            }
            case '*': {
                return new Token(this.entryPoint, this.row, startCol, TK_STAR, char, this.cursor)
            }
            case ':': {
                return new Token(this.entryPoint, this.row, startCol, TK_COLON, char, this.cursor)
            }
            case ',': {
                return new Token(this.entryPoint, this.row, startCol, TK_COMMA, char, this.cursor)
            }
            case '=': {
                return new Token(this.entryPoint, this.row, startCol, TK_EQUAL, char, this.cursor)
            }
            default: {
                const errorToken = new Token(this.entryPoint, this.row, startCol, TK_ERROR, char, this.cursor)
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
            } else if(this._isAlpha()) {
                tokens.push(this._keyword())
            } else {
                tokens.push(this._sdtokens())
            }
        }
        tokens.push(new Token(this.entryPoint, this.row, this.col, TK_EOF, "\0", this.cursor))
        return tokens
    }
}