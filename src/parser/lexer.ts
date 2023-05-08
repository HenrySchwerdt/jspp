import { readFileSync, existsSync } from "fs";
import { Token, TokenType, createToken } from "./token";
import { BSFileNotFoundException, BSLexException } from "../exceptions/exceptions";

export class Lexer {
    private readonly entryPoint: string;
    private fileContent: string;
    private cursor: number = 0;
    private row: number = 1;
    private col: number = 1;

    constructor(entryPoint: string) {
        this.entryPoint = entryPoint;
        if (!existsSync(this.entryPoint)) {
            throw new BSFileNotFoundException(this.entryPoint)
        }
        this.fileContent = readFileSync(entryPoint).toString()
    }

    private isEOF(): boolean {
        return this.fileContent.length <= this.cursor
    }

    private peek(): string {
        return this.fileContent[this.cursor]
    }

    private npeek(n: number): string {
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

    private consume(): string {
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

    private isNumeric(): boolean {
        return /^\d+$/.test(this.peek())
    }

    private isAlpha(): boolean {
        return /^[a-zA-Z]*$/.test(this.peek())
    }

    private skip() {
        const ignoredCharacters = [' ', '\t', '\r', '\n'].join("")
        while (!this.isEOF() && ignoredCharacters.includes(this.peek())) {
            this.consume()
        }
    }

    private number(): Token {
        let number = ""
        while (!this.isEOF() && this.isNumeric()) {
            number += this.consume()
        }
        return createToken(TokenType.TK_NUMBER,
            this.row,
            this.col,
            this.entryPoint,
            this.fileContent,
            number
        )
    }

    private keyword(): Token {
        const keywords: [string, TokenType][] = [
            ['let', TokenType.TK_LET],
            ['const', TokenType.TK_CONST],
            ['i8', TokenType.TK_I8],
            ['i16', TokenType.TK_I16],
            ['i32', TokenType.TK_I32],
            ['i64', TokenType.TK_I64],
            ['void', TokenType.TK_VOID],
            ['fn', TokenType.TK_FN],
            ['if', TokenType.TK_IF],
            ['else', TokenType.TK_ELSE],
            ['while', TokenType.TK_WHILE]
        ]
        const startCol = this.col
        for (let keyword of keywords) {
            const currentWord = this.npeek(keyword[0].length)
            if (currentWord == keyword[0]) {
                for (let i = 0; i < keyword[0].length; i++) {
                    this.consume()
                }
                return createToken(keyword[1],
                    this.row,
                    startCol,
                    this.entryPoint,
                    this.fileContent,
                    currentWord
                )
            }
        }
        return this.identifier()
    }

    private identifier(): Token {
        let identifier = ""
        const startCol = this.col
        while (!this.isEOF() && (this.isNumeric() || this.isAlpha())) {
            identifier += this.consume()
        }
        return createToken(TokenType.TK_IDENTIFIER,
            this.row,
            startCol,
            this.entryPoint,
            this.fileContent,
            identifier
        )
    }

    private sdtokens(): Token {
        const startCol = this.col
        const char = this.consume()
        switch (char) {
            case '.': {
                return createToken(TokenType.TK_DOT, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case '+': {
                return createToken(TokenType.TK_PLUS, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case '-': {
                return createToken(TokenType.TK_MINUS, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case '/': {
                return createToken(TokenType.TK_SLASH, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case '(': {
                return createToken(TokenType.TK_OPAREN, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case ')': {
                return createToken(TokenType.TK_CPAREN, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case '{': {
                return createToken(TokenType.TK_OBRACE, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case '}': {
                return createToken(TokenType.TK_CBRACE, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case '*': {
                return createToken(TokenType.TK_STAR, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case ':': {
                return createToken(TokenType.TK_COLON, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case ',': {
                return createToken(TokenType.TK_COMMA, this.row, startCol, this.entryPoint, this.fileContent, char)
            }
            case '=': {
                if (this.peek() == '=') {
                    return createToken(TokenType.TK_EQUAL_EQUAL, this.row, startCol, this.entryPoint, this.fileContent, char+this.consume())
                } else {
                    return createToken(TokenType.TK_EQUAL, this.row, startCol, this.entryPoint, this.fileContent, char)
                }
            }
            case '<': {
                if (this.peek() == '=') {
                    return createToken(TokenType.TK_LSE, this.row, startCol, this.entryPoint, this.fileContent, char+this.consume())
                } else {
                    return createToken(TokenType.TK_LS, this.row, startCol, this.entryPoint, this.fileContent, char)
                }
            }
            case '>': {
                if (this.peek() == '=') {
                    return createToken(TokenType.TK_GTE, this.row, startCol, this.entryPoint, this.fileContent, char+this.consume())
                } else {
                    return createToken(TokenType.TK_GT, this.row, startCol, this.entryPoint, this.fileContent, char)
                }
            }
            default: {
                const errorToken = createToken(TokenType.TK_ERROR, this.row, startCol, this.entryPoint, this.fileContent, char)
                throw new BSLexException(errorToken, this.entryPoint)
            }
        }
    }

    public tokenize(): Token[] {
        const tokens: Token[] = []
        while (!this.isEOF()) {
            this.skip()
            if (this.isNumeric()) {
                tokens.push(this.number())
            } else if (this.isAlpha()) {
                tokens.push(this.keyword())
            } else {
                tokens.push(this.sdtokens())
            }
        }
        tokens.push(createToken(TokenType.TK_EOF, this.row, this.col, this.entryPoint, this.fileContent, "\0"))
        return tokens
    }
}