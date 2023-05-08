import { execSync } from "child_process";
import { EmptyVisitor } from "../analysis/symbols";
import { Program } from "../representation/ast";

export class Compiler extends EmptyVisitor {
    private readonly oDir: string
    private readonly oFile: string

    constructor(oDir: string, oFile: string) {
        super()
        this.oDir = oDir
        this.oFile = oFile
    }

    public compile(ast: Program): void {
        ast.accept(this)
        execSync(`nasm -felf64 ${this.oDir + "/" + this.oFile}`)
        execSync(`ld -o ${this.oDir}/output ${this.oDir}/output.o`)
    }
}