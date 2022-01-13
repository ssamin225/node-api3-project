const express = require('express');

// You will need `users-model.js` and `posts-model.js` both
const User = require('./users-model');
const Post = require('../posts/posts-model')
// The middleware functions also need to be required
const { validateUserId, validateUser, validatePost, errorHandler } = require('../middleware/middleware')

const router = express.Router();

router.get('/', async (req, res, next) => {
  // RETURN AN ARRAY WITH ALL THE USERS
  try {
    const users = await User.get();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  res.status(200).json(req.user);
  // this needs a middleware to verify user id
});

router.post('/', validateUser, async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  try {
    const newUser = await User.insert(req.body)
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
  // this needs a middleware to check that the request body is valid
});

router.put('/:id', [validateUserId, validateUser], async (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  try {
    const updated = await User.update(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  try {
    const deleted = await User.remove(req.params.id);
    res.status(200).json(`deleted ${deleted} user(s)`);
  } catch (err) {
    next(err);
  }
  // this needs a middleware to verify user id
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  try {
    const posts = await Post.get();
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
  // this needs a middleware to verify user id
});

router.post('/:id/posts', [validateUserId, validatePost], async (req, res, next) => {
  // RETURN THE NEWLY CREATED USER POST
  const { body } = req;
  const { id } = req.params;
  try {
    const newPost = await Post.insert({...body, user_id: id});
    res.status(201).json(newPost);
  } catch (err) {
    next(err);
  }
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use(errorHandler);

// do not forget to export the router
module.exports = router;