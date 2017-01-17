%lex
%%

\s*\n\s*  {/* ignore */}
"("       { return '('; }
")"       { return ')'; }
";"       { return ';'; }
","       { return ','; }
\s+ {/*ignore*/}
[+-]?[0-9]+ { return 'INTEGER'; }
[a-zA-Z_][a-zA-Z_0-9$]*  { return 'IDENT'; }
[%&+\-\\\'\.//:=@~`^|*!$#?<>]+ { return 'SYMBOLICSEQ1'; }
<<EOF>>   { return 'EOF'; }
/lex


%%

file
  : expression EOF
    { return $expression; }
  ;

expression
  : term  ',' expression {
      $$ =
         $expression.type && $expression.type == 'ArrayExpression'
          ? $expression.elements.unshift($term) : {type: 'ArrayExpression', elements: [$term, $expression]}
    }
  | term { $$ = $term; }
  ;
term
  : factor SYMBOLICSEQ1 term { $$ = {type: 'BinaryExpression', operator: $SYMBOLICSEQ1, left: $factor, right: $term}; }
  | factor { $$ = $factor; }
  ;
factor
  : '(' expression ')' { $$ = $expression; }
  | number { $$ = {type: 'NumericLiteral', value: $number }; }
  | var { $$ = $var; }
  ;
var
  : ident '(' eseq ')' { $$ = {type: 'CallExpression', callee: { type: 'Identifier', name: $ident }, arguments: $eseq }; }
  | ident '(' ')' { $$ = {type: 'CallExpression', callee: { type: 'Identifier', name: $ident }, arguments: [] }; }
  | ident { $$ = {type: 'Identifier', name: $ident }; }
  | symbolicident { $$ = {type: 'Identifier', name: $symbolicident }; }
  ;
eseq
  : eseq ';' expression { $$ = $eseq; $$.push($expression); }
  | expression { $$ = [$expression]; }
  ;
number
  : integer { $$ = $integer; }
  ;
integer
  : INTEGER
    { $$ = parseInt(yytext); }
  ;
ident
  : IDENT
    { $$ = yytext; }
  ;
symbolicident
  : SYMBOLICSEQ1 { $$ = yytext; }
  ;

