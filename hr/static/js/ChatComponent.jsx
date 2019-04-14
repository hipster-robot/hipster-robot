import React from 'react';
import uuid4 from 'uuid/v4';
import MessageList from './MessageList';

class ChatComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      messages: [],
      useWolfram: true,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.submitMessage();
    }
  }

  submitMessage() {
    const tags = [];
    if (!this.state.useWolfram) tags.push('disable_wolfram');
    const message = {
      id: uuid4(),
      user: 'me',
      text: this.state.text,
      tags,
    };

    this.setState({
      text: '',
      messages: this.state.messages.concat([message]),
    });

    return fetch('/bot', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    })
      .then(response => response.json())
      .then((response) => {
        this.setState({
          messages: this.state.messages.concat([{
            id: uuid4(), // Generate the server's key client-side. This might change in the future
            user: 'bot',
            text: response.text,
          }]),
        });
      });
  }

  render() {
    return (
      <div>
        <MessageList messages={this.state.messages} />
        <form>
          <div className="form-group">
            <textarea
              className="form-control"
              placeholder="Type something"
              name="text"
              value={this.state.text}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
          </div>
          <div className="form-group form-check">
            <input
              id="wolfram-check"
              type="checkbox"
              name="useWolfram"
              className="form-check-input"
              checked={this.state.useWolfram}
              onChange={this.handleChange}
            />
            <label className="form-check-label" htmlFor="wolfram-check">
              Include Wolfram Alpha answers
            </label>
          </div>
          <div className="form-group">
            <button
              type="button"
              className="btn btn-primary btn-block"
              onClick={this.submitMessage}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default ChatComponent;
