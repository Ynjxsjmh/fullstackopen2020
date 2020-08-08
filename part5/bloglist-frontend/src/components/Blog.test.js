import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import { render } from '@testing-library/react';
import Blog from './Blog';

describe('<Blog />', () => {
  let component;

  const blog = {
    title: 'Test',
    author: 'Jest',
    url: 'google.com',
    user: '12345678910',
    likes: 2
  };

  beforeEach(() => {
    component = render(
      <Blog blog={blog} />
    );

  });

  test('renders the title of the blog', () => {
    const div = component.container.querySelector('.title');

    expect(div).toHaveTextContent(blog.title);
  });

});
