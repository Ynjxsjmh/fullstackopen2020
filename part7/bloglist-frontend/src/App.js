import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Blog from './components/Blog';
import Notification from './components/Notification';
import NewBlogForm from './components/NewBlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

import {initializeBlogs, createBlog, likeBlog, deleteBlog} from './reducers/blogReducer';
import {createNotification} from './reducers/notificationReducer';


const App = () => {
  const blogs = useSelector(state => state.blogs);
  const notification = useSelector(state => state.notification);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [isError, setIsError] = useState(false);

  const newBlogFormRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
  }, [dispatch]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username, password,
      });

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      );
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');

      dispatch(createNotification(`${user.username} login successfully`));
      setIsError(false);
    } catch (exception) {
      dispatch(createNotification(`wrong username or password`, 8));
      setIsError(true);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem('loggedBlogappUser');

    dispatch(createNotification(`${user.username} login out successfully`));
    setIsError(false);
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    newBlogFormRef.current.toggleVisibility();

    try {
      dispatch(createBlog(blogObject));
      dispatch(createNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`));
      setIsError(false);
    } catch(error) {
      dispatch(createNotification(error.response.data.error, 8));
      setIsError(true);
    }
  };

  const addLike = async (id, blogObject) => {
    try {
      dispatch(likeBlog(blogObject));
      dispatch(createNotification(`like added to ${blogObject.title} by ${blogObject.author}`));
      setIsError(false);
    } catch (error)  {
      dispatch(createNotification(error.response.data.error, 8));
      setIsError(true);
    }
  };

  const removeBlog = async (id, blogObject) => {
    try {
      dispatch(deleteBlog(id));
      dispatch(createNotification(`${blogObject.title} by ${blogObject.author} removed`));
      setIsError(false);
    } catch (error) {
      dispatch(createNotification(error.response.data.error, 8));
      setIsError(true);
    }
  };

  const loginForm = () => (
    <>
      <h2>Log in to application</h2>
      <form onSubmit={handleLogin}>
        <div>
          username
            <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password
            <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );

  const blogForm = () => (
    <>
      {blogs
       .sort((a, b) => b.likes - a.likes)
       .map(blog =>
            <Blog key={blog.id} blog={blog} user={user} addLike={addLike} removeBlog={removeBlog} />
       )}
    </>
  );

  const newBlogForm = () => (
    <Togglable buttonLabel='new blog' ref={newBlogFormRef}>
      <NewBlogForm createBlog={addBlog} user={user}/>
    </Togglable>
  );

  return (
    <div>
      <Notification message={notification} isError={isError} />

      {user === null ?
        loginForm() :
        <div>
          <h2>blogs</h2>
          <p>{user.name} logged-in
            <button onClick={handleLogout}>logout</button>
          </p>
          {newBlogForm()}
          <br />
          {blogForm()}
        </div>
      }
    </div>
  );
};

export default App;