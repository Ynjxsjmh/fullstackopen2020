export const createNotification = (content, timeout=5) => {
  return async dispatch => {
    dispatch({
      type: "SET_NOTIFICATION",
      data: content,
    });
    setTimeout(() => {
      dispatch(deleteNotification());
    }, timeout * 1000);
  };
};

export const deleteNotification = () => {
  return {
    type: 'DELETE_NOTIFICATION',
  };
};

const notificationReducer = (state = null, action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data;
    case 'DELETE_NOTIFICATION':
      return null;
    default:
      return state;
  }
};

export default notificationReducer;
