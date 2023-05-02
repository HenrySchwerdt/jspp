const fs = require("fs")
const { TK_DOT, TK_PLUS, TK_MINUS, TK_ERROR, TK_NUMBER, TK_EOF } = require("./token");

module.exports = (() => {
    let count = 0;
    let line = 1;
    let char = 1;
    let fileContent = null

    const isEOF = () => {
        return fileContent.length <= count
    }

    const isNumeric = () => {
        return /^\d+$/.test(fileContent[count])
    }

    const skipWhiteSpaces = () => {
        while (!isEOF() && (fileContent[count] == ' ' || fileContent[count] == '\t' || fileContent[count] == '\n' || fileContent[count] == '/')) {
            if (fileContent[count] == '\n') {
                char = 1
                line++
            } else if (fileContent[count] == '/' && fileContent[count + 1] == '/') {
                while(fileContent[count] != '\n') {
                    char++
                    count++
                }
            } else if (fileContent[count] == '/' && fileContent[count + 1] == '*') {
                count++
                count++
                while(fileContent[count] != '*' && fileContent[count + 1] != '/') {
                    if (fileContent[count] == '\n') {
                        line++
                        char=1
                    } else {
                        char++
                    }
                    count++
                    
                }
                count++
            } else {
                char++
            }
            count++
        }
    }

    const parseNumber = () => {
        let number = ""
        while(!isEOF() && isNumeric()) {
            number += fileContent[count]
            count++
            char++
        }
        return {tk: TK_NUMBER, line: line, char: char, valueRaw: number, value: parseInt(number)}
    }

    return {
        lex(file) {
            fileContent = fs.readFileSync(file).toString()
            count = 0;
            line = 1;
            char = 1;
        },
        nextToken() {
            skipWhiteSpaces()
            if (isEOF()) {
                return { tk: TK_EOF, line: line, char: 1, valueRaw: fileContent[count] }
            }
            if (isNumeric()) {
                let number = parseNumber()
                return number
            }
            let token = null
            switch (fileContent[count]) {
                case '.': {
                    token = { tk: TK_DOT, line: line, char: char, valueRaw: fileContent[count] }
                    count++
                    char++
                    break
                }
                case '+': {
                    token = { tk: TK_PLUS, line: line, char: char, valueRaw: fileContent[count] }
                    count++
                    char++
                    break
                }
                case '-': {
                    token = { tk: TK_MINUS, line: line, char: char, valueRaw: fileContent[count] }
                    count++
                    char++
                    break
                }
                default: {
                    token = { tk: TK_ERROR, line: line, char: char, valueRaw: fileContent[count] }
                    count++
                    char++
                }
            }
            return token
        }

    }
})()