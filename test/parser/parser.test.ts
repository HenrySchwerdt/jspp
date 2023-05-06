const { Lexer } = require("../../src/parser/lexer")

describe('Lexer tests', () => {
    test('Should lex variable declarations and assignments', () => {
        // given
        const lexer = new Lexer("test/assets/var.jspp")

        // when
        const tokens = lexer.tokenize()
        // then
        console.log(tokens)
    })

})