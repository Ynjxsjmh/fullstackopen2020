import React from 'react';

const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }

  if (message.isError) {
    return (
      <div className="notification" style={{color:'red', borderColor:'red'}}>
        {message.content}
      </div>
    );
  }

  return (
    <div className="notification">
      {message.content}
    </div>
  );
};

export default Notification;
