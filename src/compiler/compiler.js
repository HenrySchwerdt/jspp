const fs = require("fs")
const { execSync } = require("child_process");
const { segment, dumpF, quitF, entry, push, plus, minus, dump, quit, equal, offsets, addVariable, startFn, print } = require("./snippets");
module.exports = class Compiler {
    constructor(oDir, oFile) {
        this.oDir = oDir || "build";
        this.oFile = oFile || "output.asm";
        this.basePointerOffset = [];
        this.environment = [{}];
        this.currentEnvironemnt = 0;
        this.currentBasePointerOffset = 0;
        this.basePointerOffset.push(0)
    }
    _subCurrentBasePointerOffset(sub) {
      this.basePointerOffset[this.currentBasePointerOffset] -= sub
    }
    _registerVariable(name, offset, type) {
      this.environment[this.currentEnvironemnt][name] = {offset, type}
    }
    _getVariable(name) {
      return this.environment[this.currentEnvironemnt][name]
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
    _compileDeclarator(declarator, write) {
      const varName = declarator.id.name
      const varValue = declarator.init.value
      const type = declarator.init.valueType
      this._subCurrentBasePointerOffset(offsets[type])
      const varOffset = this.basePointerOffset[this.currentBasePointerOffset]
      this._registerVariable(varName, varOffset, type)
      addVariable(write, varOffset, varValue, type)
    }
    _compileDeclaration(declaration, write) {
      for(let dec of declaration.declarations) {
        this._compileDeclarator(dec, write)
      }
    }
    _compileCallExpression(expression, write) {
      if (expression.name.name == "print") {
        if (expression.args[0].type == "Identifier") {
          const vari = this._getVariable(expression.args[0].name)
          print(write, vari.offset)
        }
      }
    }

    _compileExpression(exprStatment, write) {
      switch(exprStatment.expression.type) {
        case "CallExpression":
          this._compileCallExpression(exprStatment.expression, write)
          break
      }
    }
    _compileStmt(stmt, write) {
      switch(stmt.type) {
        case "VariableDeclaration":
          this._compileDeclaration(stmt, write)
          break
        case "ExpressionStatement":
          this._compileExpression(stmt, write)
          break
      }
    }
    compile(program) {
        // helper 
        const path = this.oDir + "/" + this.oFile
        const write = (chunk) => {
            this._write(path, chunk)
        }
        this._preCompile()
        segment(write, ".text")
        quitF(write, 0)
        dumpF(write)
        entry(write)
        startFn(write)
        
        for (let stmt of program.body) {
          this._compileStmt(stmt, write)
        }
        quit(write)
        this._postCompile()
    }
}