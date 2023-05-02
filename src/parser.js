const lexer = require("./lexer")
const ops = require("./opCodes");
const { TK_EOF, TK_DOT, TK_NUMBER, TK_PLUS, TK_MINUS } = require("./token")
module.exports = (()=> {
    let current = null
    let previous = null
    let program = []

    const getToken = () => {
        previous = current
        current = lexer.nextToken()
        return current
    }

    const parseNumber = () => {
        program.push(ops.push(current.value))
    }

    const parseBinaryExpression = () => {
        parseNumber()
        getToken()
        if (current.tk == TK_MINUS || current.tk == TK_PLUS) {
            let binaryExpr = current
            getToken()
            parseNumber()
            getToken()
            switch(binaryExpr.tk) {
                case TK_PLUS:
                    program.push(ops.plus())
                    break
                case TK_MINUS:
                    program.push(ops.minus())
                    break
        }
        }
        
    }

    const parseExpression = () => {
        if (current.tk == TK_DOT) {
            program.push(ops.dump())
            getToken()
        } else if (current.tk == TK_NUMBER) {
            parseBinaryExpression()
        }
    }

    return {
        parse(file) {
            lexer.lex(file)
            program = []
            current = null
            previous = null
            getToken()
            while(current.tk != TK_EOF) {
                parseExpression()
            }
            return program
        }
    }
})()