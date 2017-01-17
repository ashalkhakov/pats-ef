var chai = require('chai')
var expect = chai.expect; // we are using  the "expect" style of Chai
var poorcode = require('./../src/poorcode')

describe('PoorCode', function() {
  console.log(poorcode);
  it('Simple location parsing should work', function() {
    expect(
      poorcode.parse('/tmp/patsopt_ccats_ZuFD70: 358(line=29, offs=5) -- 360(line=29, offs=7): error(3): the void pattern is ill-typed.')
    ).to.eql(
      [{type: 'Location',
	loc: {filepath: '/tmp/patsopt_ccats_ZuFD70', beg_ofs: 358, beg_lin: 29, beg_col: 5, end_ofs: 360, end_lin: 29, end_col: 7},
	level: '3', kind: 'error'},
       {type: 'Text', message: 'the void pattern is ill-typed.'}]
    );
    expect(
      poorcode.parse('/home/admin/org/ats/lmacrodeftest.dats: 576(line=38, offs=12) -- 611(line=38, offs=47): error(mac): error')
    ).to.eql(
      [{type: 'Location',
	loc: {filepath: '/home/admin/org/ats/lmacrodeftest.dats', beg_ofs: 576, beg_lin: 38, beg_col: 12, end_ofs: 611, end_lin: 38, end_col: 47},
	level: 'mac', kind: 'error'},
       {type: 'Text', message: 'error'}
      ]
    );
  });
  it('Actual vs needed should work', function() {
    expect(
      poorcode.parse('The actual term is: S2Ecst(atsvoid_t0ype)')
    ).to.eql(
      [{type: 'Text', message: 'The actual term is:'},
       {type: 'AST', children: {
	 type: 'CallExpression',
	 callee: {type: 'Identifier', name: 'S2Ecst'},
	 arguments: [{type: 'Identifier', name: 'atsvoid_t0ype'}]
       }}]
    );
  });
});
