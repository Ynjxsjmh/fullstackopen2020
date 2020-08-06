const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sum = blogs.reduce((total, b) => total + b.likes, 0);
  return sum;
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  const blog = blogs.sort((a, b) => b.likes - a.likes)[0];

  return (({ title, likes, author }) => ({ title, likes, author }))(blog);
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) {
    return {};
  }

  let arr = new Array();

  for (let i = 0; i < blogs.length; i++) {
    arr[blogs[i].author] = (arr[blogs[i].author] || 0) + 1;
  }

  let min = -1;
  let blog;

  Object.keys(arr).forEach(function(key) {
    if (arr[key] > min) {
      blog = {author: key, blogs: arr[key]};
      min = arr[key];
    }
  });

  return blog;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
};