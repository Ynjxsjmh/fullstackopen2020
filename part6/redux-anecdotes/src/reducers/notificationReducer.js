
export const createNotification = (content, delay=5) => {
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      data: content
    });

    setTimeout(() => {
      dispatch(deleteNotification(""));
    }, delay * 1000);
  };
};

export const deleteNotification = () => {
  return {
    type: 'DELETE_NOTIFICATION',
  };
};

const notificationReducer = (state = "", action) => {
  switch (action.type) {
    case 'SET_NOTIFICATION':
      return action.data;
    case 'DELETE_NOTIFICATION':
      return "";
    default:
      return state;
  }
};

export default notificationReducer;
