const dummy = (blogs) => {
  return 1;
};

const totalLikes = (blogs) => {
  const sum = blogs.reduce((total, b) => total + b.likes, 0);
  return sum;
};

module.exports = {
  dummy,
  totalLikes
};