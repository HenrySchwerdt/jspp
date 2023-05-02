let tkCount = 0;
function gTk() {
  return tkCount++;
}
const Token = class Token {
  
  constructor(file, row, col, type, value) {
    this.file = file
    this.row = row
    this.col = col
    this.type = type
    this.value = value
  }

}
module.exports = {
  TK_DOT: gTk(),
  TK_PLUS: gTk(),
  TK_MINUS: gTk(),
  TK_NUMBER: gTk(),
  TK_EOF: gTk(),
  TK_ERROR: gTk(),
  Token,
};