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

const Statistics = (props) => {
  const score = 1 * props.good + 0 * props.neutral + (-1) * props.bad;
  const all = props.good + props.neutral + props.bad;

  if (all === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <div>good {props.good}</div>
        <div>neutral {props.neutral}</div>
        <div>bad {props.bad}</div>
        <div>all {all}</div>
        <div>average 0</div>
        <div>positive 0</div>
      </div>
    );
  }

  return (
    <div>
      <h1>statistics</h1>
      <div>good {props.good}</div>
      <div>neutral {props.neutral}</div>
      <div>bad {props.bad}</div>
      <div>all {all}</div>
      <div>average {score/all}</div>
      <div>positive {props.good/all}</div>
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
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  );
};

ReactDOM.render(<App />,
  document.getElementById('root')
);
