const User = require('../users/users-model')

function logger(req, res, next) {
  // DO YOUR MAGIC
  console.log(`request method: ${req.method}`);
  console.log(`request url: ${req.url}`);
  console.log(`request time: ${Date.now()}`);
  next();
}

async function validateUserId(req, res, next) {
  // DO YOUR MAGIC
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (user) {
      req.user = user;
      next();
    } else {
      next({ status: 404, message: 'user not found' })
    }
  } catch (err) {
    next(err);
  }
}

function validateUser(req, res, next) {
  // DO YOUR MAGIC
  const { body } = req;
  if (!body.name) {
    next({ status: 400, message: 'missing required name field' })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  // DO YOUR MAGIC
  const { body } = req;
  if (!body.text) {
    next({ status: 400, message: 'missing required text field' })
  } else {
    next();
  }
}

function errorHandler(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message
  })
}

// do not forget to expose these functions to other modules
module.exports = {
  logger,
  validateUserId,
  validateUser,
  validatePost,
  errorHandler,
}