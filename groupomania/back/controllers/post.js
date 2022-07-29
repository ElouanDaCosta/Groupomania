const db = require('../models');
const fs = require('fs');
const auth = require('../middleware/auth');

const Post = db.post;
const User = db.user;
const Likes = db.likes;

exports.create = (req, res, next) => {
  const postObjectTemp = JSON.stringify(req.body); 
  const postObject = JSON.parse(postObjectTemp);  //très très très mauvaise pratique
  delete postObject._id;
  let post = new Post({
    ...postObject,
    userId: req.userId,
  });
  if (req.file) {
    post.image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
  }
  post.save()
    .then(() => res.status(201).json({ message: 'Post crée !' }))
    .catch(error => res.status(400).json({ error }));
}

exports.getAll = (req, res, next) => {
  let orderBy = ['createdAt', 'DESC'];
  if (req.query.order === "popularity") {
    orderBy = [db.sequelize.col('nbLikes'), 'DESC'];
  }
  Post.findAll({
    attributes: {
      include : [
        [db.sequelize.literal(`(SELECT post.userId = ${req.userId} OR users.isAdmin = 1 FROM users WHERE users.id = ${req.userId})`), 'modifiable'],
        [db.sequelize.literal(`(SELECT 1 FROM likes WHERE likes.userId = ${req.userId} AND likes.postId = post.id)`), 'liked'],
        [db.sequelize.literal(`(SELECT count(*) FROM likes WHERE likes.postId = post.id)`), 'nbLikes'],
      ]
    },
    include: [{
      model: User, as: 'user', attributes: ['name', 'image'],
    }, {
      model: Likes,
    }],
    order: [orderBy]
  })
    .then((posts) =>  res.status(200).json(posts))
    .catch(error => res.status(400).json({ error }));
}

exports.getOne = (req, res, next) => {
  Post.findOne({where:{ id: req.params.id }})
    .then((post) => 
    Likes.findAll({where:{ postId: req.params.id }})
      .then(likes => {
        let likesInt = likes.length;
        res.status(200).json({ post, likesInt });
      })
      .catch(error => res.status(400).json({ error }))
    )
    .catch(error => res.status(404).json({ error }));
}

exports.deleteOne = (req, res, next) => {
  Post.findOne({where:{ id: req.params.id }})
    .then(Post => {
      if (req.userId === Post.userId || req.isAdmin) {
        if (Post.image !== null) {
          const imageName = Post.image.split('/images/')[1];
          fs.unlink(`images/${imageName}`, (error) => {
            if (error) {
              return res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
            }
          })
        }
        Likes.destroy({where:{ postId: req.params.id }})
          .then(() => Post.destroy({where:{ id: req.params.id }})
            .then(() => res.status(200).json({ message: 'Post supprimé !' }))
            .catch(error => res.status(400).json({ error }))
          )
          .catch(error => res.status(400).json({ error }));
      } else {
        res.status(400).json({ error: 'Vous n\'avez pas le droit de supprimer ce post' });
      }
    })
    .catch(error => res.status(404).json({ error }));
}

exports.updateOne = (req, res, next) => {
  Post.findOne({where:{ id: req.params.id }})
    .then(Post => {
      if (req.userId === Post.userId || req.isAdmin) {
        if (req.file) {
          const imageName = Post.image.split('/images/')[1];
          fs.unlink(`images/${imageName}`, (error) => {
            if (error) {
              return res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
            }
          })    
        }
        const temp = JSON.stringify(req.body);
        const postObject = JSON.parse(temp);
        const post = req.file ? {
          ...postObject,
          image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...postObject};
        Post.update(post, {where:{ id: req.params.id }})
          .then(() => res.status(200).json({ message: 'Post modifié !' }))
          .catch(error => res.status(400).json({ error }));
      } else {
        res.status(400).json({ error: 'Vous n\'avez pas le droit de modifier ce post' });
      }
    })
    .catch(error => res.status(404).json({ error: 'post non trouvé' }));
}

exports.likes = (req, res, next) => {
  Likes.findOne({where:{ postId: req.params.id, userId: req.userId }})
    .then(Like => {
      if (Like) {
        Like.destroy({where:{likes: -1, postId: req.params.id, userId: req.userId }})
          .then(() => res.status(205).json({ message: 'Like supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      } else {
        Likes.create({
          postId: req.params.id,
          userId: req.userId,
        })
          .then(() => res.status(201).json({ message: 'Like créé !' }))
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(404).json({ error }));
}