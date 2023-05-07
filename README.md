# JSPP

# Grammar

```
grammar bs;

program: statement_list;

statement_list: statement+;

statment: delaration_statement
        | assign_statement;

delaration_statement: 'let' IDENT (':' TYPE)? = expression;

assign_statement: IDENT = expression;

expression:  term '+' expression
          |  term '-' expression
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