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
    case 'ArrayExpression': // elements
      const chld = node.elements.map(arg => map_r(arg));
      return {id: get_id(), name: 'array', children: chld};
    case 'CallExpression': // callee, arguments
      const callee = map_r(node.callee);
      var children = node.arguments.map(arg => map_r(arg));
      return {id: get_id(), name: callee.name, children: children};
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

    // type: Text, message
    // type: AST, children (AST to render)
    // type: Location, loc, but also level, kind
    // type: Exception, message
    var elt = null;

    switch (msg.type) {
    case 'Text':
      elt = <code>{msg.message}</code>;
      break;
    case 'AST':
      elt = <ASTVisualize ast={msg.children}/>;
      break;
    case 'Location':
      elt = <p>{msg.loc.filepath}@{msg.loc.beg_lin}:{msg.loc.beg_col}-{msg.loc.end_lin}:{msg.loc.end_col}
      {msg.loc.kind? <span>msg.loc.kind</span> : null}{msg.loc.level? <span>msg.loc.level</span> : null}</p>;
      break;
    case 'Exception':
      elt = <code style="background-color:red">{msg.message}</code>
      break;
    default:
      throw 'Unknown msg type ' + msg.type;
    }

    rows.push(<div key={i}>{elt}</div>);
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
