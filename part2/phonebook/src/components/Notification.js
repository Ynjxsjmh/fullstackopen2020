import React from 'react';

const Notification = ({ message, isError }) => {
  if (message === null) {
    return null;
  }

  if (isError) {
    return (
      <div className="error" style={{color:'red', borderColor:'red'}}>
        {message}
      </div>
    );
  }

  return (
    <div className="error">
      {message}
    </div>
  );
};

export default Notification;