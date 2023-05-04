const ASMCompiler = require("./compiler/asmCompiler")
const IRCompiler = require("./compiler/irCompiler")
const Parser = require("./parser/parser")

const CPipeline = class CPipeline {
    constructor(options) {
        this.parser = new Parser(options.entry)
        this.irCompiler = new IRCompiler()
        this.compiler = new ASMCompiler(null, null)
    }

    run() {
        try {
            this.compiler.compile(
                this.irCompiler.compile(
                    this.parser.parse()
                )
            )
        } catch (e) {
            e.print()
        }
    }
}

const IPipeline = class IPipeline {
    constructor(options) {

    }

    run() {

    }
}