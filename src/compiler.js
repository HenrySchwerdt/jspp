const fs = require("fs");
const { execSync } = require("child_process");
const cHelper = require("./cHelper")
const { OP_PUSH, OP_PLUS, OP_MINUS, OP_DUMP } = require("./opCodes.js");
module.exports = (() => {
  const oDir = "build";
  const oFile = "output.asm";
  const checkIfFileExistsAndDelete = () => {
    if (fs.existsSync(oDir)) {
      fs.rmSync(oDir, {recursive: true});
    }
    fs.mkdirSync(oDir)
  };
  const compileAsm = () => {
    execSync(`nasm -felf64 ${oDir+"/"+oFile}`)
    execSync(`ld -o ${oDir}/output ${oDir}/output.o`);
  };
  const write = (chunk) => {
    fs.appendFileSync(oDir + "/" +oFile, chunk+"\n");
  }
  return {
    compile(program) {
      checkIfFileExistsAndDelete();
      cHelper.segment(write, ".text")
      cHelper.dumpF(write)
      cHelper.quitF(write, 0)
      cHelper.entry(write)
      for(let op of program) {
        switch(op[0]) {
          case OP_PUSH: {
            cHelper.push(write, op[1])
            break
          }
          case OP_PLUS: {
            cHelper.plus(write)
            break
          }
          case OP_MINUS: {
            cHelper.minus(write)
            break;
          }
          case OP_DUMP: {
            cHelper.dump(write)
            break;
          }
        }
      }
      cHelper.quit(write)

      compileAsm();
    },
  };
})();
