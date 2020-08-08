import React, { useState } from 'react';
import blogService from '../services/blogs';

const Blog = ({ blog, setUpdate }) => {
  const [visible, setVisible] = useState(false);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  const like = async (event) => {
    event.preventDefault();
    const likes = blog.likes + 1;
    const newBlog = { ...blog, likes };
    blogService.update(blog.id, newBlog)
      .then(() => {
        setUpdate(Math.floor(Math.random() * 100));
      });
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  };

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        {blog.title}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title}
        <button onClick={toggleVisibility}>hide</button>
        <br/>
        {blog.url}
        <br/>
        {blog.likes}
        <button onClick={like}>likes</button>
        <br/>
        {blog.author}
      </div>
    </div>
  );
};

export default Blog;
