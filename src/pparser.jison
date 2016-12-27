%lex
%%

\s*\n\s*  {/* ignore */}
"("       { return '('; }
")"       { return ')'; }
";"       { return ';'; }
","       { return ','; }
\s+ {/*ignore*/}
"->" { return "->"; }
"=" { return "="; }
"<" { return "<"; }
[+-]?[0-9]+ { return 'INTEGER'; }
[a-zA-Z_][a-zA-Z_0-9$]*  { return 'IDENT'; }
[%&+-\\'./:=@~`^|*!$#?<>]+ { return 'SYMBOLICSEQ1'; }
<<EOF>>   { return 'EOF'; }
/lex


%%

file
  : expression EOF
    { return $expression; }
  ;

expression
  : term  ',' expression { $$ = [$term,$expression]; }
  | term { $$ = $term; }
  ;
term
  : factor '->' term { $$ = ['->', $factor, $term]; }
  | factor '=' term { $$ = ['=', $factor, $term]; }
  | factor '<' term { $$ = ['<', $factor, $term]; }
  | factor { $$ = $factor; }
  ;
factor
  : '(' expression ')' { $$ = $expression; }
  | number { $$ = $number; }
  | var { $$ = $var; }
  ;
var
  : ident '(' eseq ')' { $$ = ['app', $ident, $eseq]; }
  | ident '(' ')' { $$ = ['app', $ident, []]; }
  | ident { $$ = $ident; }
  ;
eseq
  : eseq ';' expression { $$ = $eseq; $$.unshift($expression); }
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

