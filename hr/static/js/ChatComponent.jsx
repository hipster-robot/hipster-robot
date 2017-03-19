import React from 'react';
import ReactDom from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.elems = [];
  }

  componentDidUpdate() {
    const latestElem = this.elems[this.elems.length-1];
    latestElem && latestElem.scrollIntoView && latestElem.scrollIntoView();
  }

  render() {
    const listItems = this.props.messages.map((message, i) => {
      const cname = `text-center message ${message.user}`;
      return <p
        key={i}
        ref={p => { this.elems.push(p); }}
        className={cname}>
        {message.message}

      </p>
    });

    return (
      <div className="messages">
        <ReactCSSTransitionGroup
          transitionName="highlight"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}>
          {listItems}
        </ReactCSSTransitionGroup>
      </div>
    )
  }
};

class ChatComponent extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      input: '',
      messages: []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
    this.submitMessage = this.submitMessage.bind(this);
  }

  handleChange(event) {
    this.setState({ input: event.target.value });
  }

  handleKeyPress(event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.submitMessage();
    }
  }

  submitMessage() {
    this.setState({
      input: '',
      messages: this.state.messages.concat([{ user: 'me', message: this.state.input }])
    });
    return fetch('/bot', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message: this.state.input })
    })
    .then(response => response.json())
    .then(response => {
      this.setState({
        messages: this.state.messages.concat([{ user: 'bot', message: response.message }]),
      });
    });
  }

  render() {
    return (
      <div>
        <MessageList messages={this.state.messages} />
        <form>
          <div className="form-group">
            <textarea className="form-control"
              placeholder="Type something"
              value={this.state.input}
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}>
            </textarea>
          </div>
          <div className="form-group">
            <button type="button" className="btn btn-default btn-block" onClick={this.submitMessage}>Send</button>
          </div>
        </form>
      </div>
    );
  }

}

export default ChatComponent;
