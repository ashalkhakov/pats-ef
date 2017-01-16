import React from 'react';
import {render} from 'react-dom';
import poorcode from './poorcode.js'

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { code: '', message: '' }
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
      <textarea cols="50" rows="30" value={this.state.code} onChange={this.handleChange}/>
      </label>
      <pre>{this.state.message}</pre>
    </div>    
  }
}

render(<App/>, document.getElementById('app'));
