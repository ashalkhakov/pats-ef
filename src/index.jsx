import React from 'react';
import {render} from 'react-dom';
import poorcode from './poorcode.js'

function Tree(props) {
  var rows = [];
  for (var i = 0; i < props.message.length; i++) {
    var msg = props.message[i];
    var res = [];

    if (msg.loc) {
      res.push(<span key={0}>{msg.loc.filepath}@{msg.loc.beg_lin}:{msg.loc.beg_col}-{msg.loc.end_lin}:{msg.loc.end_col}</span>);
      res.push(<br/>);
    }
    if (msg.msgtext) {
      res.push(<code key={1}>{msg.msgtext.msgtext}</code>);
      if (msg.msgtext.ast) {
        res.push(<code key={2}>{JSON.stringify(msg.msgtext.ast, null, 2)}</code>);
      }
    }

    rows.push(<div key={i}>{res}</div>);
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
