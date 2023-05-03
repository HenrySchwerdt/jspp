let opsCount = 0;
function gOp() {
  return opsCount++;
}

module.exports = {
  OP_PUSH: gOp(),
  OP_PLUS: gOp(),
  OP_MINUS: gOp(),
  OP_EQUAL: gOp(),
  OP_DUMP: gOp(),
  COUNT_OPS: gOp(),
  push(x) {
    return [this.OP_PUSH, x];
  },
  plus() {
    return [this.OP_PLUS];
  },
  minus() {
    return [this.OP_MINUS];
  },
  dump() {
    return [this.OP_DUMP];
  },
  equal() {
    return [this.OP_EQUAL];
  }
};
