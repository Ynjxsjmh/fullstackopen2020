import blogService from '../services/blogs';

const blogReducer = (state = [], action) => {
  switch (action.type) {
    case 'LIKE':
      const id = action.data.id;

      return state.map(blog =>
        blog.id !== id ? blog : action.data
      );
    case 'NEW_BLOG':
      return state.concat(action.data);
    case 'DELETE_BLOG':
      return state.filter(blog =>
        blog.id !== action.data.id
      );
    case 'INIT_BLOGS':
      return state.concat(action.data);
    default:
      return state;
  };
};

export const createBlog = (blogObject) => {
  return async dispatch => {
    const newBlog = await blogService.create(blogObject);

    dispatch({
      type: 'NEW_BLOG',
      data: newBlog,
    });
  };
};

export const deleteBlog = (id) => {
  return async dispatch => {
    await blogService.remove(id);

    dispatch({
      type: 'DELETE_BLOG',
      data: {id},
    });
  };
};

export const likeBlog = (likedBlog) => {
  return async dispatch => {
    await blogService.update(likedBlog.id, likedBlog);
    dispatch({
      type: 'LIKE',
      data: likedBlog,
    });
  };
};

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll();
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs,
    });
  };
};

export default blogReducer;
