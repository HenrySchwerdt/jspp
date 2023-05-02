const fs = require("fs")
const { execSync } = require("child_process");
const { segment, dumpF, quitF, entry, push, plus, minus, dump, quit } = require("./snippets");
const { OP_PUSH, OP_PLUS, OP_MINUS, OP_DUMP } = require("../opCodes");
module.exports = class Compiler {
    constructor(oDir, oFile) {
        this.oDir = oDir || "build"
        this.oFile = oFile || "output.asm"
    }
    _preCompile() {
        if (fs.existsSync(this.oDir)) {
            fs.rmSync(this.oDir, { recursive: true });
        }
        fs.mkdirSync(this.oDir)
    }
    _postCompile() {
        execSync(`nasm -felf64 ${this.oDir+"/"+this.oFile}`)
        execSync(`ld -o ${this.oDir}/output ${this.oDir}/output.o`);
    }
    _write(path, chunk) {
        fs.appendFileSync(path, chunk+"\n");
    }

    compile(program) {
        // helper 
        const path = this.oDir + "/" + this.oFile
        const write = (chunk) => {
            this._write(path, chunk)
        }
        this._preCompile()
        segment(write, ".text")
        dumpF(write)
        quitF(write, 0)
        entry(write)
        for(let op of program) {
            switch(op[0]) {
              case OP_PUSH: {
                push(write, op[1])
                break
              }
              case OP_PLUS: {
                plus(write)
                break
              }
              case OP_MINUS: {
                minus(write)
                break;
              }
              case OP_DUMP: {
                dump(write)
                break;
              }
            }
          }
        quit(write)  

        this._postCompile()
    }
}