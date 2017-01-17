import React from 'react';
import {render} from 'react-dom';
import poorcode from './poorcode.js';

import css from './tree.css';

function ast2json(root) {
  var id = 0;
  function get_id() {
    return id++;
  }

  function map_r(node) {
    switch (node.type) {
    case 'NumericLiteral': // value
      return {id: get_id(), name: node.value.toString()};
    case 'Identifier': // name
      return {id: get_id(), name: node.name};
    case 'BinaryExpression': // operator, left, right
      const left = map_r(node.left);
      const right = map_r(node.right);
      return {id: get_id(), name: node.operator, children: [left, right]};
    case 'CallExpression': // callee, arguments
      const callee = map_r(node.callee);
      const children = node.arguments.map(arg => map_r(arg));
      return {id: get_id(), name: 'call', children: children};
    default:
      throw "map_r: unhandled node type " + node.type;
    }
  }

  return map_r(root);
}

function ASTNode(props) {
  return (<ul id={props.value.id}>
          <div>{props.value.name}</div>
          {props.value.children?
           props.value.children.map((c,i) => <li key={i}><ASTNode value={c}/></li>)
           : null
          }
    </ul>);
}

function ASTVisualize(props) {
  var json = ast2json(props.ast);
  console.log(JSON.stringify(props.ast, null, 2));
  return <div className='ast'><ASTNode value={json}/></div>;
  //return <code>{JSON.stringify(props.ast, null, 2)}</code>;
}

function Tree(props) {
  var rows = [];
  for (var i = 0; i < props.message.length; i++) {
    var msg = props.message[i];
    var res = [];

    rows.push(<div key={i}>
              {msg.loc? <span>{msg.loc.filepath}@{msg.loc.beg_lin}:{msg.loc.beg_col}-{msg.loc.end_lin}:{msg.loc.end_col}</span> : null}
              {msg.loc? <br/> : null}
              {msg.msgtext && msg.msgtext.msgtext? <code>{msg.msgtext.msgtext}</code> : null}
              {msg.msgtext && msg.msgtext.ast? <ASTVisualize ast={msg.msgtext.ast}/> : null}
              </div>);
  }
  
  return <div>{rows}</div>;
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code: '', message: [] };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let code = event.target.value;
    let message = poorcode.parse(code);
    
    this.setState({code: code, message: message});
    event.preventDefault();
  }
  
  render () {
    return <div>
      <label>
      Error from <code>patsopt</code>:
      </label>

      <textarea cols="80" rows="30" value={this.state.code} onChange={this.handleChange}/>
      <br/>
      
      <label>Result:</label>
      <Tree message={this.state.message}/>
    </div>    
  }
}

render(<App/>, document.getElementById('app'));
