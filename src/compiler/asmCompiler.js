const fs = require("fs")
const { execSync } = require("child_process");
const operators = {
  '+': 'add',
  '-': 'sub'
}
const { segment, dumpF, quitF, entry, push, plus, minus, dump, quit, equal, offsets, types, addVariable, startFn, print } = require("./snippets");
module.exports = class ASMCompiler {
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
    this.environment[this.currentEnvironemnt][name] = { offset, type }
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
    execSync(`nasm -felf64 ${this.oDir + "/" + this.oFile}`)
    execSync(`ld -o ${this.oDir}/output ${this.oDir}/output.o`);
  }
  _write(path, chunk) {
    fs.appendFileSync(path, chunk + "\n");
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
    for (let dec of declaration.declarations) {
      this._compileDeclarator(dec, write)
    }
  }

  _compileCallExpression(expression, write) {
    if (expression.name.name == "print") {
      if (expression.args[0].type == "Identifier") {
        const vari = this._getVariable(expression.args[0].name)
        print(write, vari.offset)
      } else if (expression.args[0].type == "Literal") {
        print(write, expression.args[0].value)
      }
    }
  }

  _compileLiteral(literal) {
    return literal.value
  }

  _compileIdentifier(identifier) {
    return this._getVariable(identifier.name).offset
  }
  /*
    mov rax, 10
    mov rbx, 20
    add rbx, rax
    move WORD [rbt-offset], rbx
  */
  _compileBinaryExpression(expression, write) {
    const op = operators[expression.operator]
    let expressionTE = null
    if (expression.left.type == 'BinaryExpression') {
      this._compileBinaryExpression(expression.left, write)
      expressionTE = expression.right
    }
    if (expression.right.type == 'BinaryExpression') {
      this._compileBinaryExpression(expression.right, write)
      if (expressionTE) {
        expressionTE = null
      } else {
        expressionTE = expression.left
      }
    }
    if (expressionTE) {
      switch (expressionTE.type) {
        case 'Literal':
          write(`   ${op} eax, ${this._compileLiteral(expression.right)}`)
          break
        case 'Identifier':
          write(`   ${op} eax, [rbp${this._compileIdentifier(expression.right)}]`)
      }
    }
  }

  _compileAssignmentExpression(expression, write) {
    const vari = this._getVariable(expression.left.name)
    switch (expression.right.type) {
      case "Literal":
        addVariable(write, vari.offset, expression.right.value, vari.type)
        break
      case "BinaryExpression":
        this._compileBinaryExpression(expression.right, write)
        write(`   mov ${types[vari.type]} [rbp${vari.offset}], eax`)
    }
  }

  _compileExpression(exprStatment, write) {
    switch (exprStatment.expression.type) {
      case "CallExpression":
        this._compileCallExpression(exprStatment.expression, write)
        break
      case "AssigmentExpression":
        this._compileAssignmentExpression(exprStatment.expression, write)
        break
    }
  }
  _compileStmt(stmt, write) {
    switch (stmt.type) {
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