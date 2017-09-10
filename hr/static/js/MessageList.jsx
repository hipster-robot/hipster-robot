import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import PropTypes from 'prop-types';
import uuid4 from 'uuid/v4';

class MessageList extends React.Component {
  constructor(props) {
    super(props);
    this.elems = [];
  }

  componentDidUpdate() {
    const latestElem = this.elems[this.elems.length - 1];
    if (latestElem && latestElem.scrollIntoView) latestElem.scrollIntoView();
  }

  render() {
    const listItems = this.props.messages.map((message) => {
      const cname = `text-center message ${message.user}`;
      const txt = (message.text || '').split('\n').map((item) => {
        return <span key={uuid4()}>{item}<br /></span>;
      });
      return (
        <p
          key={message.id}
          ref={p => this.elems.push(p)}
          className={cname}
        >
          {txt}
        </p>
      );
    });

    return (
      <div className="messages">
        <ReactCSSTransitionGroup
          transitionName="highlight"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {listItems}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

MessageList.propTypes = {
  messages: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default MessageList;
