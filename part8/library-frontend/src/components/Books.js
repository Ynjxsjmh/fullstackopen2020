import React, { useState, useEffect } from 'react';

import { useQuery, useLazyQuery } from '@apollo/client';

import { ALL_BOOKS } from '../queries';

const Books = (props) => {
  const initialBooksResult = useQuery(ALL_BOOKS);
  const [getBooks, booksResult] = useLazyQuery(ALL_BOOKS);
  const [genre, setGenre] = useState('');
  const [books, setBooks] = useState([]);

  useEffect( () => {
    getBooks();
  }, []);

  useEffect(() => {
    if (booksResult.data) {
      setBooks(booksResult.data.allBooks);
    }
  }, [booksResult.data]);

  if (!props.show) {
    return null;
  };

  if (booksResult.loading || initialBooksResult.loading) return <p>Loading...</p>;

  let genres = initialBooksResult.data.allBooks.flatMap(b => b.genres);
  genres = [...new Set(genres)];

  const handleGenreChange = (g) => {
    getBooks({ variables: { genreToSearch: g } });
    setGenre(g);
  };

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
          {
           books
             .map(a =>
             <tr key={a.title}>
               <td>{a.title}</td>
               <td>{a.author.name}</td>
               <td>{a.published}</td>
             </tr>)
          }
        </tbody>
      </table>

      <div>
        {genres.map(g =>
          <button key={g} onClick={ () => handleGenreChange(g)  }>
            {g}
          </button>
        )}

        <button onClick={ () => {getBooks(); setGenre("all genres");} }>
          all genres
        </button>
      </div>
    </div>
  );
};

export default Books;
