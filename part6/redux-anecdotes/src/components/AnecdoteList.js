import React from 'react';
import { connect } from 'react-redux';
import { voteById } from '../reducers/anecdoteReducer';
import { createNotification } from '../reducers/notificationReducer';

const AnecdoteList = (props) => {

  const vote = (anecdote) => {
    props.voteById(anecdote);
    props.createNotification(`You voted ${anecdote.content}`);
  };

  return (
    <div>
      {props.anecdotes
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
  const anecdotes = state.anecdotes.filter(anecdote => anecdote.content.toLowerCase().includes(state.filter.toLowerCase()));
  return {
    anecdotes
  };
};

const mapDispatchToProps = {
  voteById,
  createNotification
};

const ConnectedAnecdoteList = connect(mapStateToProps, mapDispatchToProps)(AnecdoteList);
export default ConnectedAnecdoteList;
