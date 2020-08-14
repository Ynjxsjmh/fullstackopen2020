import React from 'react';

import { ALL_BOOKS, ME } from "../queries";
import { useQuery } from "@apollo/client";


const Recommend = (props) => {
  const booksResult = useQuery(ALL_BOOKS);
  const meResult = useQuery(ME);

  if (!props.show) {
    return null;
  }

  if (booksResult.loading || meResult.loading)  {
    return <div>loading...</div>;
  }

  const books =  booksResult.data.allBooks;
  const favoriteGenre = meResult.data.me.favoriteGenre;

  return (
    <div>
      <h2>recommendations</h2>

      <div>
        books in your favorite genre {favoriteGenre}
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
          {favoriteGenre ? (
             books
               .filter(b =>
                 b.genres.includes(favoriteGenre)
               )
               .map(b =>
               <tr key={b.title}>
                 <td>{b.title}</td>
                 <td>{b.author.name}</td>
                 <td>{b.published}</td>
               </tr>)
           ) : (
            books
              .map(b =>
              <tr key={b.title}>
                <td>{b.title}</td>
                <td>{b.author.name}</td>
                <td>{b.published}</td>
              </tr>)
           )
          }
        </tbody>
      </table>

    </div>
  );
};

export default Recommend;
