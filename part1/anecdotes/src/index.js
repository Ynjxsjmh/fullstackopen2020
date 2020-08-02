import React, { useState } from 'react';
import ReactDOM from 'react-dom';

const App = (props) => {
  const [selected, setSelected] = useState(0);
  const [points, setPoints] = useState(new Array(props.anecdotes.length).fill(0));
  const [mostVotedIdx, setMostVotedIdx] = useState(0);

  const randomAnecdote = () => {
    const arrLen = props.anecdotes.length;
    const random = Math.floor(Math.random() * arrLen);
    setSelected(random);
  };

  const vote = () => {
    const copy = [...points];
    copy[selected] += 1;
    setPoints(copy);
    setMostVotedIdx(getMostVoted(props.anecdotes));
  };

  const getMostVoted = (arr) => {
    let idx = 0;
    for (let i = 0 ; i < arr.length; i++) {
      if (arr[i] > arr[idx]) {
        idx = i;
      }
    }
    return idx;
  };

  return (
    <>
      <div>
        <h1>Anecdote of the day</h1>
        <div>
          {props.anecdotes[selected]}
        </div>
        <div>
          has {points[selected]} votes
        </div>
        <button onClick={vote}>vote</button>
        <button onClick={randomAnecdote}>next anecdote</button>
      </div>
      <div>
        <h1>Anecdote with the most votes</h1>
        <div>
          {props.anecdotes[mostVotedIdx]}
        </div>
        <div>
          has {points[mostVotedIdx]} votes
        </div>
      </div>
    </>
  );
};

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
];

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
);
