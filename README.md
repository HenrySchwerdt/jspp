# JSPP

# Grammar

```
grammar bs;

program: statement_list;

statement_list: statement+;

statment: assign_statement;

assign_statement: 'let' IDENT (':' TYPE)? = expression;

expression:  expression '+' term
          |  expression '-' term
          |  term;

term: term '*' factor
    | term '/' factor
    | factor;

factor: IDENT
      | INTLIT;

TYPE: 'i32';
INTLIT: ('0' .. '9')+;
WHITESPACE: [\t\r\n] -> skip;


```