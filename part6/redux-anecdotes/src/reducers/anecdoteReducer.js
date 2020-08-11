import anecdoteService from '../services/anecdotes';

const reducer = (state = [], action) => {
  console.log('state now: ', state);
  console.log('action', action);

  switch (action.type) {
    case 'VOTE':
      const id = action.data.id;

      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : action.data
      );
    case 'NEW_ANECDOTE':
      return state.concat(action.data);
    case 'INIT_ANECDOTES':
      return state.concat(action.data);
    default:
      return state;
  };

  return state;
};

export const createAnecdote = (content) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(content);

    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote,
    });
  };
};

export const voteById = (anecdoteToVote) => {
  return async dispatch => {
    const votedAnecdote = {
      ...anecdoteToVote,
      votes: anecdoteToVote.votes + 1
    };
    await anecdoteService.addLike(votedAnecdote);
    dispatch({
      type: 'VOTE',
      data: votedAnecdote,
    });
  };
};

export const initializeAnecdotes = (anecdotes) => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll();
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes,
    });
  };
};

export default reducer;
