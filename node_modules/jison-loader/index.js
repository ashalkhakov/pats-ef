"use strict";

/*
	BSD License https://opensource.org/licenses/BSD-3-Clause
	Authors
		Artyom Shalkhakov @ashalkhakov
*/

var jison = require("jison");

module.exports = function(source) {
  var parser = new jison.Parser(source);
  var parserSource = parser.generate();

  return parserSource;
}
