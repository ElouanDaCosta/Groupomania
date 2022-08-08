const db = require('../models');
const fs = require('fs');
const auth = require('../middleware/auth');

const Post = db.post;
const User = db.user;
const Likes = db.likes;

exports.create = (req, res, next) => {
  const postObjectTemp = JSON.stringify(req.body); 
  //bad practice
  const postObject = JSON.parse(postObjectTemp);
  //delete the default id
  delete postObject._id;
  //create new post
  let post = new Post({
    //using decomposition to copy the property of an source object on a new object 
    ...postObject,
    userId: req.userId,
  });
  //if there is a file, used multer to rename and save the file
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
        /*
        use of sequelize.literal to allow to  to directly 
        insert arbitrary content into the query without any automatic escaping
        */
        [db.sequelize.literal(`(SELECT post.userId = ${req.userId} OR users.isAdmin = 1 FROM users WHERE users.id = ${req.userId})`), 'modifiable'],
        [db.sequelize.literal(`(SELECT 1 FROM likes WHERE likes.userId = ${req.userId} AND likes.postId = post.id)`), 'liked'],
        [db.sequelize.literal(`(SELECT count(*) FROM likes WHERE likes.postId = post.id)`), 'nbLikes'],
      ]
    },
    //include the user model with the name and image attributes and the likes model
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
    .then((post) => res.status(200).json(post))
    .catch(error => res.status(404).json({ error }));
}

exports.deleteOne = (req, res, next) => {
  Post.findOne({where:{ id: req.params.id }})
    .then(post => {
      if (req.userId === post.userId || req.isAdmin) {
        //if post.image differente of null, delete the image
        if (post.image !== '') {
          const imageName = post.image.split('/images/')[1];
          fs.unlink(`images/${imageName}`, (error) => {
            if (error) {
              return res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
            }
          })
        }
        //destroy the all likes on the post
        Likes.destroy({where:{ postId: req.params.id }})
        //and destroy the post
          .then(() => Post.destroy({where:{ id: req.params.id }})
            .then(() => res.status(200).json({ message: 'Post supprimé !' }))
            .catch(error => res.status(400).json({ error }))
          )
          .catch(error => res.status(400).json({ error }));
      } else {
        //if you are not the author of the post or an admin, you can't delete it
        res.status(400).json({ error: 'Vous n\'avez pas le droit de supprimer ce post' });
      }
    })
    .catch(error => res.status(404).json({ error }));
}

exports.updateOne = (req, res, next) => {
  Post.findOne({where:{ id: req.params.id }})
    .then(post => {
      if (req.userId === post.userId || req.isAdmin) {
        //if there is a file, used multer to delete the old file and save the new
        if (post.image !== '' && req.file) {
          const imageName = post.image.split('/images/')[1];
            fs.unlink(`images/${imageName}`, (error) => {
              if (error) {
                res.status(500).json({ error: 'Erreur lors de la suppression de l\'image' });
                return
              }
            })  
        }
        const temp = JSON.stringify(req.body);
        const postObject = JSON.parse(temp);
        //ternaire operator to check if there is a file
        const postItem = req.file ? {
          //using decomposition to copy the property of an source object on a new object
          ...postObject,
          image: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...postObject};
        Post.update(postItem, {where:{ id: req.params.id }})
          .then(() => res.status(200).json({ message: 'Post modifié !' }))
          .catch(error => res.status(400).json({ error }));
      } else {
        //if you are not the author of the post or an admin, you can't update it
        res.status(400).json({ error: 'Vous n\'avez pas le droit de modifier ce post' });
      }
    })
    .catch(error => res.status(404).json({ error: 'post non trouvé' }));
}

exports.likes = (req, res, next) => {
  //find the likes of the post with the user id
  Likes.findOne({where:{ postId: req.params.id, userId: req.userId }})
    .then(Like => {
      //if the user has already liked the post, destroy the like
      if (Like) {
        Like.destroy({where:{likes: -1, postId: req.params.id, userId: req.userId }})
          .then(() => res.status(205).json({ message: 'Like supprimé !' }))
          .catch(error => res.status(400).json({ error }));
      } else {
        //if the user has not liked the post, create a new like with the post id and user id
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