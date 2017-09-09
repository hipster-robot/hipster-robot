import React from 'react';
import { render } from 'react-dom';
import ChatComponent from './ChatComponent';

function App() {
  return <ChatComponent />;
}

render(<App />, document.getElementById('app'));
