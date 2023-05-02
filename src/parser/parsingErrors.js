const ansicolor = require("ansicolor")


const UnexpectedTokenError = class UnexpectedTokenError extends Error {
    constructor(errorToken, fileName, fileContent) {
        super(`Unexpected token '${errorToken.value}' at ${fileName} in line ${errorToken.row}.`)
        this.errorToken = errorToken
        this.fileName = fileName
        this.fileContent = fileContent
    }

    print() {
        console.log(ansicolor.red("ERROR while Lexing:"))
        console.log(ansicolor.red(" -   " +this.message))
        console.log()
        const lines = this.fileContent.split('\n')

        console.log(`Error found in ${this.fileName}:${this.errorToken.row}:${this.errorToken.col}\n`)
        if (this.errorToken.row > 1) {
            const number = `${this.errorToken.row - 1} |`
            console.log(ansicolor.cyan(number+'\t') + ansicolor.lightMagenta(lines[this.errorToken.row - 2]))
        }
        const number = `${this.errorToken.row} |`
        console.log(ansicolor.cyan(number+'\t') + ansicolor.lightMagenta(lines[this.errorToken.row - 1]))
        const indent = (this.errorToken.row - 1).toString().length + 6
        console.log(ansicolor.red(number.replace(/./g, " ")  + (new Array(4 + this.errorToken.col)).fill('-').join('') + '^'))
    }
}

const GrammarError = class GrammarError extends Error {
    constructor(message, falsyToken, fileName, fileContent) {
        super(message)
        this.falsyToken = falsyToken
        this.fileName = fileName
        this.fileContent = fileContent
    }

    print() {
        console.log(ansicolor.red("ERROR while Parsing:"))
        console.log(ansicolor.red(" -   " +this.message))
        const lines = this.fileContent.split('\n')
        console.log(`Error found in ${this.fileName}:${this.falsyToken.row}:${this.falsyToken.col + this.falsyToken.value.length}\n`)
        if (this.falsyToken.row > 1) {
            const number = `${this.falsyToken.row - 1} |`
            console.log(ansicolor.cyan(number+'\t') + ansicolor.lightMagenta(lines[this.falsyToken.row - 2]))
        }
        const number = `${this.falsyToken.row} |`
        console.log(ansicolor.cyan(number+'\t') + ansicolor.lightMagenta(lines[this.falsyToken.row - 1]))
        const indent = (this.falsyToken.row - 1).toString().length + 6
        console.log(ansicolor.red(number.replace(/./g, " ")  + (new Array(4 + this.falsyToken.col + this.falsyToken.value.length)).fill('-').join('') + '^'))
    }
} 

module.exports = {
    UnexpectedTokenError,
    GrammarError
}