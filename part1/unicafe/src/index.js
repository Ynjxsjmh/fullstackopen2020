import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
);

const Feedback = (props) => {
  return (
    <>
      <h1>give feedback</h1>
      <Button handleClick={props.handleGoodClick}    text="good" />
      <Button handleClick={props.handleNeutralClick} text="neutral" />
      <Button handleClick={props.handleBadClick}     text="bad" />
    </>
  );
};

const Statistic = (props) => {
  return (
    <div>
      <h1>statistic</h1>
      <div>good {props.good}</div>
      <div>neutral {props.neutral}</div>
      <div>bad {props.bad}</div>
    </div>
  );
};

const App = () => {
  // save clicks of each button to own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const handleGoodClick = () => {
    setGood(good + 1);
  };

  const handleNeutralClick = () => {
    setNeutral(neutral + 1);
  };

  const handleBadClick = () => {
    setBad(bad + 1);
  };

  return (
    <div>
      <Feedback handleGoodClick={handleGoodClick} handleNeutralClick={handleNeutralClick} handleBadClick={handleBadClick} />
      <Statistic good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />,
  document.getElementById('root')
);
