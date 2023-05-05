import { Token } from "./token"
import ansicolor from "ansicolor"


export class UnexpectedTokenError extends Error {
    fileName: string
    errorToken: Token
    constructor(errorToken: Token, fileName: string) {
        super(`Unexpected token '${errorToken.value}' at ${fileName} in line ${errorToken.position.row}.`)
        this.errorToken = errorToken
        this.fileName = fileName

    }

    print() {
        console.log(ansicolor.red("ERROR while Lexing:"))
        console.log(ansicolor.red(" -   " +this.message))
        console.log()
        console.log(`Error found in ${this.fileName}:${this.errorToken.position.row}:${this.errorToken.position.col}\n`)
        const number = `${this.errorToken.position.row} |`
        console.log(ansicolor.cyan(number+'\t') + ansicolor.lightMagenta(this.errorToken.position.line))
        const indent = (this.errorToken.position.row - 1).toString().length + 6
        console.log(ansicolor.red(number.replace(/./g, " ")  + (new Array(4 + this.errorToken.position.col)).fill('-').join('') + '^'))
    }
}

export class GrammarError extends Error {
    falsyToken: Token
    fileName: string
    constructor(message: string, falsyToken: Token, fileName: string) {
        super(message)
        this.falsyToken = falsyToken
        this.fileName = fileName
    }

    print() {
        console.log(ansicolor.red("ERROR while Parsing:"))
        console.log(ansicolor.red(" -   " +this.message))
        console.log(`Error found in ${this.fileName}:${this.falsyToken.position.row}:${this.falsyToken.position.col + this.falsyToken.value.length}\n`)
     
        const number = `${this.falsyToken.position.row} |`
        console.log(ansicolor.cyan(number+'\t') + ansicolor.lightMagenta(this.falsyToken.position.line))
        const indent = (this.falsyToken.position.row - 1).toString().length + 6
        console.log(ansicolor.red(number.replace(/./g, " ")  + (new Array(4 + this.falsyToken.position.col + this.falsyToken.value.length)).fill('-').join('') + '^'))
    }
}