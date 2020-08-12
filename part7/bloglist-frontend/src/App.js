import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Blog from './components/Blog';
import Notification from './components/Notification';
import NewBlogForm from './components/NewBlogForm';
import Togglable from './components/Togglable';

import {initializeBlogs, createBlog, likeBlog, deleteBlog} from './reducers/blogReducer';
import {createNotification} from './reducers/notificationReducer';
import {login, logout, initializeUser } from './reducers/userReducer';


const App = () => {
  const blogs = useSelector(state => state.blogs);
  const notification = useSelector(state => state.notification);
  const user = useSelector(state => state.user);

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const newBlogFormRef = useRef();

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(initializeBlogs());
    dispatch(initializeUser());
  }, [dispatch]);

  const setNotification = (content, isError, timeout=5) => {
    dispatch(createNotification({ content, isError }, timeout));
  };

  const handleLogin = (event) => {
    event.preventDefault();

    try {
      dispatch(login(username, password));
      setUsername('');
      setPassword('');

      setNotification(`${username} login successfully`, false);
    } catch (exception) {
      console.log(exception);
      setNotification(`wrong username or password`, true, 8);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    setNotification(`${user.username} logout successfully`, false);
    dispatch(logout());
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