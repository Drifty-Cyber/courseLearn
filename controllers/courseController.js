exports.sayWelcome = (req, res, next) => {
  console.log('Welcome to Course Learn');
  res.status(200).json({
    status: 'success',
    message: 'Welcome to course learn',
  });

  next();
};
