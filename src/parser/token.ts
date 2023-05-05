export enum TokenType {
    TK_DOT,
    TK_PLUS,
    TK_MINUS,
    TK_SLASH,
    TK_STAR,
    TK_COMMA,
    TK_EQUAL,
    TK_OPAREN,
    TK_CPAREN,
    TK_EQUAL_EQUAL,
    TK_I32,
    TK_NUMBER,
    TK_LET,
    TK_COLON,
    TK_IDENTIFIER,
    TK_EOF,
    TK_ERROR,
}

export class Position {
    readonly row: number;
    readonly col: number;
    readonly file: string;
    readonly line: string;

    constructor(row: number, col: number, file: string, line: string) {
        this.row = row
        this.col = col
        this.file = file
        this.line = line
    }
}

export class Token {
    readonly type: TokenType;
    readonly position: Position;
    readonly value: string;
    constructor(type: TokenType, position: Position, value: string) {
        this.type = type
        this.position = position
        this.value = value
    }
}

export function createToken(type: TokenType, row: number, col: number, file: string, fileContent: string, value: string) {
    return new Token(type, new Position(row, col, file, fileContent.split('\n')[row-1]), value)
}