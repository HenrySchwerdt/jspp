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
    TK_OBRACE,
    TK_CBRACE,
    TK_EQUAL_EQUAL,
    TK_GT,
    TK_GTE,
    TK_LS,
    TK_LSE,
    TK_I8,
    TK_I16,
    TK_I32,
    TK_I64,
    TK_F32,
    TK_F64,
    TK_STR,
    TK_NUMBER,
    TK_VOID,
    TK_IF,
    TK_ELSE,
    TK_WHILE,
    TK_FOR,
    TK_LET,
    TK_CONST,
    TK_FN,
    TK_COLON,
    TK_SEMICOLON,
    TK_RETURN,
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