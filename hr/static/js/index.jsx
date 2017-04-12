import React from 'react';
import { render } from 'react-dom';
import ChatComponent from './ChatComponent';

function App() {
  return (
    <div>
      <ChatComponent />
    </div>
  );
}

render(<App />, document.getElementById('app'));
