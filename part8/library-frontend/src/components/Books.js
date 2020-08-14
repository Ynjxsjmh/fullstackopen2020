import React, { useState } from 'react';

import { useQuery } from '@apollo/client';

import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const [genre, setGenre] = useState('');
  const result = useQuery(ALL_BOOKS);

  if (!props.show) {
    return null;
  };

  if (result.loading)  {
    return <div>loading...</div>;
  }

  const books =  result.data.allBooks;

  let genres = books.flatMap(b => b.genres);
  genres = [...new Set(genres)];

  return (
    <div>
      <h2>books</h2>

      <div>
        in genre <b>{genre}</b>
      </div>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {genre ? (
             books
               .filter(b =>
                 b.genres.includes(genre)
               )
               .map(a =>
               <tr key={a.title}>
                 <td>{a.title}</td>
                 <td>{a.author.name}</td>
                 <td>{a.published}</td>
               </tr>)
           ) : (
            books
              .map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>)
           )
          }
        </tbody>
      </table>

      <div>
        {genres.map(g =>
          <button key={g} onClick={() => setGenre(g)}>
            {g}
          </button>
        )}

        <button onClick={() => setGenre('')}>
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
