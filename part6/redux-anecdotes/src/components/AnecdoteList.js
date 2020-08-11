import React from 'react';
import { useDispatch } from 'react-redux';
import { connect } from 'react-redux';
import { voteById } from '../reducers/anecdoteReducer';
import { createNotification } from '../reducers/notificationReducer';

const AnecdoteList = (props) => {
  const dispatch = useDispatch();

  const anecdotesToShow = () => {
    return props.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(props.filter.toLowerCase()));
  };

  const vote = (anecdote) => {
    dispatch(voteById(anecdote));
    dispatch(createNotification(`You voted ${anecdote.content}`));
  };

  return (
    <div>
      {anecdotesToShow()
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

const mapStateToProps = (state) => {
  return {
    anecdotes: state.anecdotes,
    filter: state.filter
  };
};

const ConnectedAnecdoteList = connect(mapStateToProps)(AnecdoteList);
export default ConnectedAnecdoteList;
