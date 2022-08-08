const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../models');
const fs = require('fs');
require('dotenv').config();

const User = db.user;
const Post = db.post;

exports.signup = (req, res, next) => {
  User.findOne ({where: {email: req.body.email}})
    .then(user => {
      //if the user already exists, return an error
      if (user) {
        res.status(409).json({ error: 'Email already exists' });
        return 
      }
      //if the req.body.email is empty, return an error
      if (req.body.email === '') {
        res.status(400).json({ error: 'Veuillez entrez une addresse mail' });
        return 
      } 
      //if the req.body.password is empty, return an error
      else if (req.body.password === '') {
        res.status(418).json({ error: 'Veuillez entrez un mot de passe' });
        return 
      }
      //if the req.body.passwordConfirmation is empty, return an error
      else if (req.body.passwordConfirmation === '') {
        res.status(412).json({ error: 'Veuillez confirmer le mot de passe' });
        return 
      } 
      //if the req.body.password and req.body.passwordConfirmation are different, return an error
      else if (req.body.passwordConfirmation !== req.body.password) {
        res.status(412).json({ error: 'Les mots de passe ne correspondent pas !' });
        return 
      } 
      // hash the req.body.password and create a new user
      else {
        bcrypt.hash(req.body.password, 10)
        .then(hash => {
          const user = User.build ({
            name : req.body.name,
            email : req.body.email,
            password : hash
          });
          user.save()
            .then(() => res.status(201).json({message: 'User created'}))
            .catch(error => res.status(400).json({ error}));
        })
        .catch(error => res.status(500).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.login = (req, res, next) => {
  User.findOne ({where: {email: req.body.email}})
    .then(user => {
      // if the user doesn't exist, return an error
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          // if the password is invalid, return an error
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
          // if the password is valid, return a token
          res.status(200).json({
            userId: user.id,
            token: jwt.sign(
              { userId: user.id, isAdmin: user.isAdmin },
              process.env.TOKEN,
              { expiresIn: '24h' }
            )
          });
        })
        .catch(error => res.status(500).json({ error }));
    })
    .catch(error => res.status(500).json({ error }));
};

exports.logout = (req, res, next) => {
  User.findOne ({where: {id: req.userId}})
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      } else {
        res.status(200).json({ message: 'Logout successful' });
      }
    })
    .catch(error => res.status(500).json({ error }));
};

exports.updateUser = (req, res, next) => {
  User.findOne ({where: {id: req.userId}})
    .then(user => {
      //if the req.userId is equal to the target userId, execute the function
      if (req.userId === user.id) {
        //if there is a file, used multer to delete the old file and save the new
        if (user.image !== '') {
          const imageName = user.image.split('/images/')[1];
            fs.unlink(`images/${imageName}`, (error) => {
              if (error) {
                res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
                return
              }
            })  
        }
        const temp = JSON.stringify(req.body);
        const userObject = JSON.parse(temp);
        //ternaire operator to check if there is a file
        const useR = req.file ? {
          //using decomposition to copy the property of an source object on a new object
          ...userObject,
          image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...userObject,};
        User.update(useR, {where:{ id: req.params.id }})
          .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
          .catch(error => res.status(400).json({ error }));
      }
      //if you are not the user you can't update it
      else {
        res.status(401).json({ error: 'Vous n\'avez pas le droit d\'effectuer cette action !' });
        return
      }
    })
};

exports.getOne = (req, res, next) => {
  User.findOne ({where: {id: req.params.id}})
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      } else {
        res.status(200).json({
          id: user.id,
          name: user.name,
          email:user.email,
          image:user.image
        });
      }
    })
    .catch(error => res.status(500).json({ error }));
}

exports.deleteUser = (req, res, next) => {
  User.findOne ({where: {id: req.params.id}})
    .then(user => {
      //if the req user id is equal to the user id, execute the function
      if (req.userId === user.id) {
        if (user.image !== '') {
          const imageName = user.image.split('/images/')[1];
            fs.unlink(`images/${imageName}`, (error) => {
              if (error) {
                res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
                return
              }
            })
        }
          //destroy all the posts of the user
        Post.destroy({where: {userId: req.params.id}})
          .then(() => {
            //destroy the user
            User.destroy({where: {id: req.params.id}})
              .then(() => res.status(200).json({ message: 'Utilisateur supprimé !' }))
              .catch(error => res.status(500).json({ error }));
          })
          .catch(error => res.status(500).json({ error }));
        /*user.destroy()
          .then(() => res.status(205).json({ message: 'User deleted' }))
          .catch(error => res.status(500).json({ error }));*/
      } else {
        //if you are not the user you can't delete it
        res.status(401).json({ error: 'Vous n\'avez pas le droit d\'effectuer cette action !' });
        return
      }
    })
    .catch(error => res.status(500).json({ error }));
}