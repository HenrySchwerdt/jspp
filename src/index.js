const commandLineArgs = require("command-line-args");
const interpreter = require("./interpreter");
const compiler = require("./compiler");
const parser = require("./parser")

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
}
program = parser.parse(options.entry)
if (options.sim == true) {
  interpreter.interpret(program);
}

if (options.compile == true) {
  compiler.compile(program);
}
