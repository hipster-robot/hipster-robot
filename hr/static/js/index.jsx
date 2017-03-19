import React from 'react';
import {render} from 'react-dom';
import ChatComponent from './ChatComponent.jsx';

class App extends React.Component {
  render () {
    return (
      <div>
        <ChatComponent />
      </div>
    )
  }
}

render(<App/>, document.getElementById('app'));
