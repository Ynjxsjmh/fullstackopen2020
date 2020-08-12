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

  const setNotification = (content, isError, timeout=5) => {
    dispatch(createNotification({ content, isError }, timeout));
  };

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

      setNotification(`${user.username} login successfully`, false);
    } catch (exception) {
      setNotification(`wrong username or password`, true, 8);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem('loggedBlogappUser');

    setNotification(`${user.username} login out successfully`, false);
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    newBlogFormRef.current.toggleVisibility();

    try {
      dispatch(createBlog(blogObject));
      setNotification(`a new blog ${blogObject.title} by ${blogObject.author} added`, false);
    } catch(error) {
      setNotification(error.response.data.error, true, 8);
    }
  };

  const addLike = async (id, blogObject) => {
    try {
      dispatch(likeBlog(blogObject));
      setNotification(`like added to ${blogObject.title} by ${blogObject.author}`, false);
    } catch (error)  {
      setNotification(error.response.data.error, true, 8);
    }
  };

  const removeBlog = async (id, blogObject) => {
    try {
      dispatch(deleteBlog(id));
      setNotification(`${blogObject.title} by ${blogObject.author} removed`, false);
    } catch (error) {
      console.log("^^^^^^^^^^^^^^^^^^^");
      setNotification(error.response.data.error, true, 8);
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
      <Notification message={notification} />

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