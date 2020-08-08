import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Notification from './components/Notification';
import NewBlogForm from './components/NewBlogForm';
import Togglable from './components/Togglable';
import blogService from './services/blogs';
import loginService from './services/login';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [notification, setNotification] = useState(null);
  const [isError, setIsError] = useState(false);

  const newBlogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    );
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const setNotificationAndTimeout = (message, isError, timeout=5000) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, timeout);
    setIsError(isError);
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

      setNotificationAndTimeout(`${user.username} login successfully`, false);
    } catch (exception) {
      setNotificationAndTimeout(`wrong username or password`, true, 8000);
    }
  };

  const handleLogout = (event) => {
    event.preventDefault();

    window.localStorage.removeItem('loggedBlogappUser');

    setNotificationAndTimeout(`${user.username} login out successfully`, false);
    setUser(null);
  };

  const addBlog = async (blogObject) => {
    newBlogFormRef.current.toggleVisibility();
    blogService.create(blogObject).then(blog => {
      setBlogs(blogs.concat(blog));
      setNotificationAndTimeout(`a new blog ${blog.title} by ${blog.author} added`, false);
    })
    .catch(error => {
      setNotificationAndTimeout(error.response.data.error, true, 8000);
    });
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
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
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