let tkCount = 0;
function gTk() {
  return tkCount++;
}

module.exports = {
  TK_DOT: gTk(),
  TK_PLUS: gTk(),
  TK_MINUS: gTk(),
  TK_NUMBER: gTk(),
  TK_EOF: gTk(),
  TK_ERROR: gTk()
};