import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render, fireEvent } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;
  const mockHandlerLike = jest.fn();
  const mockHandlerRemove = jest.fn();

  const blog = {
    title: 'Test',
    author: 'Jest',
    url: 'google.com',
    user: '12345678910',
    likes: 2
  };

  const user = {
    username: 'meme'
  };

  beforeEach(() => {
    component = render(
      <Blog blog={blog} user={user} addLike={mockHandlerLike} removeBlog={mockHandlerRemove} />
    );

  });

  test('renders the title of the blog', () => {
    const div = component.container.querySelector('.title');

    expect(div).toHaveTextContent(blog.title);
  });

  test('click view to show blog detail', () => {
    const button = component.getByText('view');
    fireEvent.click(button);

    const div = component.container.querySelector('.detail');

    expect(div).toHaveTextContent(blog.url);
    expect(div).toHaveTextContent(blog.likes);
    expect(div).toHaveTextContent(blog.author);
  });

  test('clicking the like button twice calls event handler passed as a prop twice', () => {
    const likeButton = component.getByText('likes');

    fireEvent.click(likeButton);
    fireEvent.click(likeButton);

    expect(mockHandlerLike.mock.calls).toHaveLength(2);
  });

});
