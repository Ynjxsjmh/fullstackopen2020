import loginService from '../services/login';
import blogService from '../services/blogs';

export const setUser = (user) => {
  return async dispatch => {
    blogService.setToken(user.token);
    dispatch({
      type: 'SET_USER',
      data: user,
    });
  };
};

export const initializeUser = () => {
  return async dispatch => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
    }
  };
};

export const login = (username, password) => {
  return async dispatch => {
    const user = await loginService.login({
      username, password
    });
    window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
    dispatch(setUser(user));
  };
};

export const logout = () => {
  window.localStorage.removeItem('loggedBlogappUser');
  return {
    type: 'LOGOUT',
  };
};

const userReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_USER':
      return action.data;
    case 'LOGOUT':
      return null;
    default:
      return state;
  }
};

export default userReducer;
