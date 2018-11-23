import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import bcrypt from 'bcryptjs';
import User from '../data/users';
import parcels from '../data/parcels';

const router = express.Router();
const emmailFormat = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

router.post('/register', (req, res) => {
  const errors = [];
  if (req.body.password.length < 8) {
    errors.push({
      text: 'Password must be at least 8 characters',
    });
  }

  if (req.body.name.length < 3) {
    errors.push({
      text: 'Your Names Should have at least 3 Character',
    });
  }

  if (!emmailFormat.test(req.body.email)) {
    errors.push({
      text: 'Enter valid Email',
    });
  }

  if (errors.length > 0) {
    res.status(400).send(errors);
  } else {
    // Ckecking if the Email is already existing or Registered
    const existingUser = User.filter(user => user.email === req.body.email);
    if (existingUser.length > 0) {
      return res.status(400).send({
        success: false,
        message: 'Email is already registered',
      });
    }
    // code snipet from my friend Blaise to encrypyt password
    try {
      const newUser = {
        userId: User.length + 1,
        names: req.body.names,
        email: req.body.email,
        phone: req.body.phone,
        password: req.body.password,
      };
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newUser.password, salt);
      newUser.password = hash;
      User.push(newUser);

      return res.status(201).send({
        success: true,
        message: 'User is successfully registered',
      });
    } catch (err) {
      res.send({
        success: false,
        message: `Failed to register, error: ${err} `,
      });
    }
  }
  return res.send({
    success: false,
    message: 'User not registered! Please try again',
  });
});

// Get user parcel delivery orders
router.get('/:userId/parcels', (req, res) => {
  let userParcels = [];
  req.params.userId = Number(req.params.userId);

  const user = User.filter(eachUser => eachUser.userId === req.params.userId);
  if (user.length > 0) {
    userParcels = parcels.filter(parcel => parcel.userId === req.params.userId);
    if (userParcels.length > 0) {
      return res.status(200).json({
        success: true,
        message: 'User parcels retrieved successfully',
        userId: req.params.userId,
        parcels: userParcels,
      });
    }
    return res.status(404).json({
      success: true,
      message: 'User has no parcels',
    });
  }
  return res.status(404).json({
    success: false,
    message: 'User not Exist',
  });
});

module.exports = router;
