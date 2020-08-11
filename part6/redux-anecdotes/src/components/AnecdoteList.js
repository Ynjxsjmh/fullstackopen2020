import React from 'react';
import { voteById } from '../reducers/anecdoteReducer';
import { useSelector, useDispatch } from 'react-redux';

const AnecdoteList = () => {
  const anecdotes = useSelector(state => state.anecdotes);
  const dispatch = useDispatch();

  const vote = (id) => {
    dispatch(voteById(id));
  };

  return (
    <div>
      {anecdotes
       .sort((a, b) => b.votes - a.votes)
       .map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnecdoteList;
