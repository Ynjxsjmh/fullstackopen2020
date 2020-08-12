import React, { useState } from 'react';

const Blog = ({ blog, user, addLike, removeBlog }) => {
  const [visible, setVisible] = useState(false);
  const [isOwn, setIsOwn] = useState(true);

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const removeWhenOwn = { display: isOwn ? '' : 'none' };

  const toggleVisibility = () => {
    setVisible(!visible);
    if (blog.user.username !== user.username) {
      setIsOwn(false);
    }
  };

  const like = async (event) => {
    event.preventDefault();
    const likes = blog.likes + 1;
    const newBlog = { ...blog, likes };
    addLike(blog.id, newBlog);
  };

  const remove = async (event) => {
    event.preventDefault();

    if (window.confirm(`remove blog ${blog.title}) by ${blog.author}`)) {
      removeBlog(blog.id, blog);
    }
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
      <div style={hideWhenVisible} className="title">
        {blog.title}
        <button onClick={toggleVisibility}>view</button>
      </div>
      <div style={showWhenVisible} className="detail">
        {blog.title}
        <button onClick={toggleVisibility}>hide</button>
        <br/>
        {blog.url}
        <br/>
        {blog.likes}
        <button onClick={like}>likes</button>
        <br/>
        {blog.author}
        <div style={removeWhenOwn}>
          <button onClick={remove}>remove</button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
