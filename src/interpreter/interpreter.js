const { OP_PUSH, OP_PLUS, OP_MINUS, OP_DUMP, OP_EQUAL } = require("../opCodes.js");
module.exports = class Interpreter {
    interpret(program) {
        const stack = [];
        for (let op of program) {
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
                case OP_EQUAL: {
                    const a = stack.pop()
                    const b = stack.pop()
                    stack.push(a == b ? 1 : 0)
                    break;
                }
                case OP_DUMP: {
                    console.log(stack.pop());
                    break;
                }
            }
        }
    }
}