import anecdoteService from '../services/anecdotes';

const reducer = (state = [], action) => {
  console.log('state now: ', state);
  console.log('action', action);

  switch (action.type) {
    case 'VOTE':
      const id = action.data.id;

      const anecdoteToVote = state.find(a => a.id === id);
      const votedAnecdote = {
        ...anecdoteToVote,
        votes: anecdoteToVote.votes + 1
      };

      return state.map(anecdote =>
        anecdote.id !== id ? anecdote : votedAnecdote
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

export const createAnecdote = (data) => {
  return {
    type: 'NEW_ANECDOTE',
    data
  };
};

export const voteById = (id) => {
  return {
    type: 'VOTE',
    data: { id }
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
