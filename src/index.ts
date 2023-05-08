import commandLineArgs from "command-line-args";
import { SimulatePipeline } from "./pipelines";

const optionDefinitions = [
  { name: "entry", type: String, defaultOption: true },
  { name: "sim", alias: "s", type: Boolean },
  { name: "compile", alias: "c", type: Boolean },
];

const options = commandLineArgs(optionDefinitions);

if (options.entry == undefined) {
  console.error("Usage: <JSPP> <ENTRY> <FLAGS>\n");
  console.error("ENTRY:");
  console.error("   fileName: The file to simulate or the compile");
  console.error("FLAGS:");
  console.error("   -s    Simulate the program");
  console.error("   -c    Compiles the program");
  console.error("ERROR: Provided no entry file to compile or to simulate.");
} else {
  if (options.sim == true) {
    new SimulatePipeline(options.entry).run()
  }

  // const parser = new Parser(options.entry)
  // const program = parser.parse()
  // console.log(JSON.stringify(program, null, 2))
  // if (options.sim == true) {
  //   const interpreter = new Interpreter()
  //   interpreter.interpret(program);
  // }

  // if (options.compile == true) {
  //   const compiler = new Compiler(null, null)
  //   compiler.compile(program);
  // }

}
