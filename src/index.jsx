import React from 'react';
import {render} from 'react-dom';
import poorcode from './poorcode.js';
import SyntaxTree from './syntaxtree.jsx';
import { PageHeader, ListGroup, ListGroupItem, FormGroup, FormControl, ControlLabel } from 'react-bootstrap';

function MessageList(props) {
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
      elt = <SyntaxTree ast={msg.children}/>;
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

    rows.push(<ListGroupItem key={i}>{elt}</ListGroupItem>);
  }
  
  return <ListGroup>{rows}</ListGroup>;
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
      <PageHeader>Paste your ATS error message! <small>And have it converted to something hopefully more digestable</small></PageHeader>

      <form>
      <FormGroup controlId="formControlsTextarea">
      <ControlLabel>Error message:</ControlLabel>
      <FormControl style={{ height: 200 }} componentClass="textarea" placeholder="Error message..." value={this.state.code} onChange={this.handleChange} />
      </FormGroup>
      </form>
    
      <h2>Results:</h2>
      <MessageList message={this.state.message}/>
    </div>    
  }
}

render(<App/>, document.getElementById('app'));
