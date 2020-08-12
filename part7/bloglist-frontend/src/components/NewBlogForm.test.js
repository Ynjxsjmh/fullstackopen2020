import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import NewBlogForm from './NewBlogForm';

test('<NewBlogForm /> updates parent state and calls onSubmit', () => {
  const createBlog = jest.fn();

  const component = render(<NewBlogForm createBlog={createBlog} />);

  const inputTitle = component.container.querySelector('input[name="Title"]');
  const inputAuthor = component.container.querySelector('input[name="Author"]');
  const inputUrl = component.container.querySelector('input[name="Url"]');
  const form = component.container.querySelector('form');

  const blog = {
    title: "test",
    author: "fdjsl",
    url: "example.com"
  };

  fireEvent.change(inputTitle, {
    target: { value: blog.title },
  });
  fireEvent.change(inputAuthor, {
    target: { value: blog.author },
  });
  fireEvent.change(inputUrl, {
    target: { value: blog.url },
  });
  fireEvent.submit(form);

  expect(createBlog.mock.calls).toHaveLength(1);
  expect(createBlog.mock.calls[0][0].title).toBe(blog.title);
  expect(createBlog.mock.calls[0][0].author).toBe(blog.author);
  expect(createBlog.mock.calls[0][0].url).toBe(blog.url);
});
