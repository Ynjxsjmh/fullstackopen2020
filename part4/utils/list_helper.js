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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};