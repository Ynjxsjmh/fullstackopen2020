import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { voteById } from '../reducers/anecdoteReducer';
import { createNotification } from '../reducers/notificationReducer';

const AnecdoteList = () => {
  const anecdotes = useSelector(({filter, anecdotes}) => {
    return anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(filter.toLowerCase()));
  });
  const dispatch = useDispatch();

  const vote = (anecdote) => {
    dispatch(voteById(anecdote));
    dispatch(createNotification(`You voted ${anecdote.content}`));
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
            <button onClick={() => vote(anecdote)}>vote</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnecdoteList;
