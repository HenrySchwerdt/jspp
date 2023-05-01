const { OP_PUSH, OP_PLUS, OP_MINUS, OP_DUMP } = require("./opCodes.js");
module.exports = (() => {
  return {
    interpret(program) {
      stack = [];
      for (op of program) {
        switch (op[0]) {
          case OP_PUSH:
            stack.push(op[1]);
            break;
          case OP_PLUS: {
            const a = stack.pop();
            const b = stack.pop();
            stack.push(a + b);
            break;
          }
          case OP_MINUS: {
            const a = stack.pop();
            const b = stack.pop();
            stack.push(b - a);
            break;
          }
          case OP_DUMP: {
            console.log(stack.pop());
            break;
          }
        }
      }
    },
  };
})();
