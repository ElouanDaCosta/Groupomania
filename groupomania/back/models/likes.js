'use strict';
const {
  Model
} = require('sequelize');
const user = require('./user');
const post = require('./post');


//use like model to create connection between post and user table
module.exports = (sequelize, DataTypes) => {
  class likes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({likes, user, post}) {
      user.hasMany(likes);
      likes.belongsTo(user);
      post.hasMany(likes);
      likes.belongsTo(post);
    }
  }
  likes.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
  }, {
    sequelize,
    modelName: 'likes',
  });
  return likes;
};