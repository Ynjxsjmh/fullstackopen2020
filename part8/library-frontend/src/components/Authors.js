import React, { useState } from 'react';

import { useQuery, useMutation } from '@apollo/client';

import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries';

const Authors = (props) => {
  const [name, setName] = useState('');
  const [born, setBorn] = useState('');

  const result = useQuery(ALL_AUTHORS);

  const [updateAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!props.show) {
    return null;
  }

  if (result.loading)  {
    return <div>loading...</div>;
  }

  const authors = result.data.allAuthors;

  const submit = async (event) => {
    event.preventDefault();

    updateAuthor({ variables: { name, setBornTo: parseInt(born) } });

    setName('');
    setBorn('');
  };


  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>

      <div>
        <h2>Set birthyear</h2>
        <form onSubmit={submit}>
          <div>
            name
            <input
              value={name}
              onChange={({ target }) => setName(target.value)}
            />
          </div>
          <div>
            born
            <input
              value={born}
              onChange={({ target }) => setBorn(target.value)}
            />
          </div>
          <button type='submit'>update author</button>
        </form>
      </div>
    </div>
  );
};

export default Authors;
