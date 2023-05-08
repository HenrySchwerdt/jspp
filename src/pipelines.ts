import { IdentifierPass } from "./analysis/identfier";
import { SimplificationPass } from "./analysis/simplification";
import { BSException } from "./exceptions/exceptions";
import { Interpreter } from "./interpreter/interpreter";
import { Lexer } from "./parser/lexer";
import { Parser } from "./parser/parser";

export class SimulatePipeline {
    entry: string;
    constructor(entry: string) {
        this.entry = entry
    }
    run() {
        try {
            const lexer = new Lexer(this.entry)
            const parser = new Parser(lexer.tokenize())
            const ast = parser.parse()
            new SimplificationPass().pass(ast)
            new IdentifierPass().pass(ast)
            new Interpreter().interpret(ast)
        } catch (e) {
            (e as BSException).print();
        }

    }
}