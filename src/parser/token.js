let tkCount = 0;
function gTk() {
  return tkCount++;
}
const Token = class Token {
  
  constructor(file, row, col, type, value, cursor) {
    this.file = file
    this.row = row
    this.col = col
    this.type = type
    this.value = value
    this.cursor = cursor
  }

}
module.exports = {
  TK_DOT: gTk(),
  TK_PLUS: gTk(),
  TK_MINUS: gTk(),
  TK_SLASH: gTk(),
  TK_STAR: gTk(),
  TK_COMMA: gTk(),
  TK_EQUAL: gTk(),
  TK_OPAREN: gTk(),
  TK_CPAREN: gTk(),
  TK_EQUAL_EQUAL: gTk(),
  TK_I32: gTk(),
  TK_NUMBER: gTk(),
  TK_LET: gTk(),
  TK_COLON: gTk(),
  TK_IDENTIFIER: gTk(),
  TK_EOF: gTk(),
  TK_ERROR: gTk(),
  Token,
};