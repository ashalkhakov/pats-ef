%lex
%%

\s*\n\s*  {/* ignore */}
"("       { return '('; }
")"       { return ')'; }
";"       { return ';'; }
","       { return ','; }
\s+ {/*ignore*/}
"->" { return "->"; }
[0-9]+ { return 'INTEGER'; }
[a-zA-Z_][a-zA-Z_0-9]*  { return 'IDENT'; }
[%&+-\\'./:=@~`^|*!$#?<>]+ { return 'SYMBOLICSEQ1'; }
<<EOF>>   { return 'EOF'; }
/lex


%%

file
  : node EOF
    { return $node; }
  ;

node
  : ident '(' ')'
    { $$ = [ 'ident', $ident ]; }
  | ident '(' ident ')'
    { $$ = [ 'ident2ident', $ident1, $ident2 ]; }
  | ident '(' integer ')'
    { $$ = [ 'ident2integer', $ident, $integer ]; }
  | ident '(' symbolicident ')'
    { $$ = [ 'ident2symbolic', $ident, $symbolicident ]; }
  | ident '(' node ';' nodelst ')'
    { $$ = [ 'app', $ident, [ $node, $nodelst ] ]; }
  | ident '(' integer '->' node ')'
    { $$ = [ 'mapsto', $integer, $node ]; }
  ;

nodelst
  : nodelst ',' node
    { $$ = $nodelst; $$.unshift($node); }
  | node
    { $$ = [$node]; }
  ;

ident
  : IDENT
    { $$ = yytext; }
  ;
integer
  : INTEGER
    { $$ = yytext; }
  ;
symbolicident
  : SYMBOLICSEQ1 { $$ = yytext; }
  ;

