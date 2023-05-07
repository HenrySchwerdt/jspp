import * as colors from "ansi-colors";
import { Token } from "../parser/token";
import { Node } from "../representation/ast";

export abstract class BSException extends Error {
  constructor(message: string) {
    super(message);
  }
  abstract print(): void;
}

export class BSFileNotFoundException extends BSException {
  constructor(fileName: string) {
    super(`Could not find file '${fileName}' in the provided path.`);
  }

  print(): void {
    console.log(colors.red("ERROR FILE NOT FOUND:"));
    console.log(colors.red(" -   " + this.message));
    console.log();
    console.log(
      colors.red(
        " -   Please consider checking your directory or file and run this command again."
      )
    );
  }
}

export class BSParseException extends BSException {
  falsyToken: Token;
  fileName: string;
  constructor(message: string, falsyToken: Token, fileName: string) {
    super(message);
    this.falsyToken = falsyToken;
    this.fileName = fileName;
  }

  print(): void {
    console.log(colors.red("ERROR while Parsing:"));
    console.log(colors.red(" -   " + this.message));
    console.log(
      `Error found in ${this.fileName}:${this.falsyToken.position.row}:${
        this.falsyToken.position.col + this.falsyToken.value.length
      }\n`
    );

    const number = `${this.falsyToken.position.row} |`;
    console.log(
      colors.cyan(number + "\t") + colors.magenta(this.falsyToken.position.line)
    );
    console.log(
      colors.red(
        number.replace(/./g, " ") +
          new Array(
            4 + this.falsyToken.position.col + this.falsyToken.value.length
          )
            .fill("-")
            .join("") +
          "^"
      )
    );
  }
}

export class BSLexException extends BSException {
  fileName: string;
  errorToken: Token;
  constructor(errorToken: Token, fileName: string) {
    super(
      `Unexpected token '${errorToken.value}' at ${fileName} in line ${errorToken.position.row}.`
    );
    this.errorToken = errorToken;
    this.fileName = fileName;
  }

  print() {
    console.log(colors.red("ERROR while Lexing:"));
    console.log(colors.red(" -   " + this.message));
    console.log();
    console.log(
      `Error found in ${this.fileName}:${this.errorToken.position.row}:${this.errorToken.position.col}\n`
    );
    const number = `${this.errorToken.position.row} |`;
    console.log(
      colors.cyan(number + "\t") + colors.magenta(this.errorToken.position.line)
    );
    console.log(
      colors.red(
        number.replace(/./g, " ") +
          new Array(4 + this.errorToken.position.col).fill("-").join("") +
          "^"
      )
    );
  }
}

export class BSCompileException extends BSException {
  fileName: string;
  node: Node;
  constructor(message: string, node: Node, fileName: string) {
    super(message);
    this.node = node;
    this.fileName = fileName;
  }

  print() {
    console.log(colors.red("CompileError:"));
    console.log(colors.red(` -  ${this.message}`));
    console.log();
    console.log(
      `Error found in ${this.fileName}:${this.node.position.row}:${this.node.position.col}\n`
    );
    const number = `${this.node.position.row} |`;
    console.log(
      colors.cyan(number + "\t") + colors.magenta(this.node.position.line)
    );
    console.log(
      colors.red(
        number.replace(/./g, " ") +
          new Array(4 + this.node.position.col).fill("-").join("") +
          "^"
      )
    );
  }
}
