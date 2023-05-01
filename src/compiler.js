const fs = require("fs");
const { execSync } = require("child_process");
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
    fs.appendFileSync(oDir + "/" +oFile, chunk);
  }
  return {
    compile(program) {
      checkIfFileExistsAndDelete();
      write("segment .text\n");
      write("global _start\n");
      write("_start:\n");
      write("   mov rax, 60\n");
      write("   mov rdi, 0\n");
      write("   syscall\n");

      compileAsm();
    },
  };
})();
