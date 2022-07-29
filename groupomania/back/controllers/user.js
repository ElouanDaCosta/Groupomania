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
      if (user) {
        return res.status(409).json({ error: 'Email already exists' });
      }
      if (req.body.email === '') {
        return res.status(400).json({ error: 'Veuillez entrez une addresse mail' });
      } else if (req.body.passwordConfirmation === '') {
          return res.status(412).json({ error: 'Veuillez confirmer le mot de passe' });
      } else if (req.body.passwordConfirmation !== req.body.password) {
          return res.status(412).json({ error: 'Les mots de passe ne correspondent pas !' });
      } else {
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
      if (!user) {
        return res.status(401).json({ error: 'Utilisateur non trouvé !' });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ error: 'Mot de passe incorrect !' });
          }
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
      if (req.userId === user.id) {
        if (req.file) {
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
        const useR = req.file ? {
          ...userObject,
          image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : {...userObject,};
        User.update(useR, {where:{ id: req.params.id }})
          .then(() => res.status(200).json({ message: 'Utilisateur modifié !' }))
          .catch(error => res.status(400).json({ error }));
      } else {
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
      if (req.userId === user.id) {
        const imageName = user.image.split('/images/')[1];
          fs.unlink(`images/${imageName}`, (error) => {
            if (error) {
              res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
              return
            }
          })
        Post.destroy({where: {userId: req.params.id}})
          .then(() => {
            res.status(200).json({ message: 'Post of the user has been deleted' });
          })
          .catch(error => res.status(500).json({ error }));
        user.destroy()
          .then(() => res.status(205).json({ message: 'User deleted' }))
          .catch(error => res.status(500).json({ error }));
      } else {
        res.status(401).json({ error: 'Vous n\'avez pas le droit d\'effectuer cette action !' });
        return
      }
    })
    .catch(error => res.status(500).json({ error }));
}