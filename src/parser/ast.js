const AstNode = class AstNode {
    constructor(type, start, end) {
        this.type = type
        this.start = start
        this.end = end
    }
}
const Program = class Program extends AstNode {
    constructor(start, end, body) {
        super("Program", start, end)
        this.body = body
    }
}
const ExpressionStatement = class ExpressionStatement extends AstNode {
    constructor(start, end, expression) {
        super("ExpressionStatement", start, end)
        this.expression = expression
    }
}

const UnaryExpression = class UnaryExpression extends AstNode {
    constructor(start, end, operator, prefix, argument) {
        super("UnaryExpression", start, end)
        this.operator = operator
        this.prefix = prefix
        this.argument = argument
    }
}

const BinaryExpression = class BinaryExpression extends AstNode {
    constructor(start, end, left, operator, right) {
        super("BinaryExpression", start, end)
        this.left = left
        this.operator = operator
        this.right = right
    }
}

const AssigmentExpression = class AssigmentExpression extends AstNode {
    constructor(start, end, operator, left, right) {
        super("AssigmentExpression", start, end) 
        this.operator = operator
        this.left = left
        this.right = right
    }
}

const CallExpression = class CallExpression extends AstNode {
    constructor(start, end, name, args) {
        super("CallExpression", start, end)
        this.args = args
        this.name = name
    }
}

const VariableDeclaration = class VariableDeclaration extends AstNode {
    constructor(start, end, declarations) {
        super("VariableDeclaration", start, end)
        this.declarations = declarations
    }
}
const VariableDeclarator = class VariableDeclarator extends AstNode {
    constructor(start, end, id, init) {
        super("VariableDeclarator", start, end)
        this.id = id
        this.init = init
    }
}
const Identifier = class Identifier extends AstNode {
    constructor(start, end, name) {
        super("Identifier", start, end)
        this.name = name
    }
}
const Literal = class Literal extends AstNode {
    constructor(start, end, value, raw, valueType) {
        super("Literal", start, end)
        this.value = value
        this.raw = raw
        this.valueType = valueType
    }
}
module.exports = {
    Program,
    VariableDeclaration,
    UnaryExpression,
    VariableDeclarator,
    BinaryExpression,
    ExpressionStatement,
    AssigmentExpression,
    CallExpression,
    Identifier,
    Literal
}

