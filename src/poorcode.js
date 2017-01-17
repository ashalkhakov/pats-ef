import pparser from './pparser.jison'

function tryparsing(code) {
  try {
    var obj = pparser.parse(code);
    return obj;
  }
  catch (e) { return e.message; }
}

function check_re1(rexp) {
  return function(line) {
    var ere = rexp.exec(line);
    if (ere) {
      var res = tryparsing(ere[2]);
      return [{type: 'Text', message: ere[1]}, {type: 'AST', children: res}];
    }
    return null;
  }
}

function parseit(code) {

  var lines = code.split("\n");
  var lines_out = [];

  // message info
  var re0 = /([^:]+): (\d+)\(line=(\d+), offs=(\d+)\) -- (\d+)\(line=(\d+), offs=(\d+)\)(.*)/;
  function make_loc(ere0) {
    return {
      filepath: ere0[1],
      beg_ofs: parseInt(ere0[2]),
      beg_lin: parseInt(ere0[3]),
      beg_col: parseInt(ere0[4]),
      end_ofs: parseInt(ere0[5]),
      end_lin: parseInt(ere0[6]),
      end_col: parseInt(ere0[7])
    };
  }
  var re1 = /: (error|warning)\(([a-zA-Z0-9]+)\): (.*)/;
    
  var re2 = check_re1(/(The actual term is:) (.*)/);
  var re3 = check_re1(/(The needed term is:) (.*)/);
  var re4 = check_re1(/(unsolved constraint for termination metric being decreasing:) (.*)/);

  var re5 = function(line) {
    var ere = /the form of dynamic expression \[([^\]]+)\] is unsupported for macro expansion/.exec(line);
    if (ere) {
      var res = tryparsing(ere[1]);
      return [
        {type: 'Text', message: 'the form of dynamic expression'},
        {type: 'AST', children: res},
        {type: 'Text', message: 'is unsupported for macro expansion'}
      ];
    }
    return null;
  }
  var re6 = function(line) {
    var ere = /the expansion of the dynamic expression at \((.+)\) is expected to return code \(AST\) but it does not\./.exec(line);
    if (ere) {
      var ere0 = re0.exec(ere[1]);
      var loc = make_loc(ere0);
      
      return [
        {type: 'Text', message: "the expansion of the dynamic expression at "},
        {type: 'Location', loc: loc},
        {type: 'Text', message: " is expected to return code (AST) but it does not."}
      ];
    }
    return null;
  }
  var re7 = function(line) {
    var ere = /the constraint \[(.+)\] cannot be translated into a form accepted by the constraint solver\./.exec(line);
    if (ere) {
      var expr = tryparsing(ere[1]);
	    
      return [
        {type: 'Text', message: "the constraint "},
        {type: 'AST', children: expr},
        {type: 'Text', message: " cannot be translated into a form accepted by the constraint solver."}
      ];
    }
    return null;
  }
  var re8 = check_re1(/(unsolved constraint:) (.*)/);
  var re9 = check_re1(/(the dynamic expression cannot be assigned the type) \[(.+)\]/);
  
  function
  attempt_filtering(frag) {
    var match;

    match = re2(frag);
    if (match) { return match; }
    match = re3(frag);
    if (match) { return match; }
    match = re4(frag);
    if (match) { return match; }
    match = re5(frag);
    if (match) { return match; }
    match = re6(frag);
    if (match) { return match; }
    match = re7(frag);
    if (match) { return match; }
    match = re8(frag);
    if (match) { return match; }
    match = re9(frag);
    if (match) { return match; }
  }

  try {
    for (
      var ln = 0;
      ln < lines.length;
      ln++)
    {
      var line = lines[ln];

      var ere0 = re0.exec(line);
      if (ere0) {
	var loc = make_loc(ere0);
	var rest = ere0[8];
	var ere1 = re1.exec(rest);
	if (ere1) {
	  var msgkind = ere1[1];
	  var msglevel = ere1[2];

	  rest = ere1[3];
	  var rest_flt = attempt_filtering(rest);

	  lines_out.push({type: 'Location', loc: loc, level: msglevel, kind: msgkind});
          if (rest_flt) {
            lines_out.push.apply(lines_out, rest_flt); // rest_flt is an array, concat!
          }
          else {
            lines_out.push({type: 'Text', message: rest});
          }
	  continue;
	}
      }

      var flt = attempt_filtering(line);
      if (flt) {
        lines_out.push.apply(lines_out, flt); // flt is an array, concat!
      }
      else {
        // unknown line... complain?
        lines_out.push({type: 'Text', message: line});
      }
    }
    return lines_out;
  }
  catch (e) {
    return [{type: 'Exception', message: e.message}];
  }
}

exports.parse = parseit;
