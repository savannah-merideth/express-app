'use strict';

module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Please provide a value for the book title',
        },
      },
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: "Please provide a value for the author's name",
        },
      },
    },
    genre: DataTypes.STRING,
    year: DataTypes.INTEGER
  }, {
      tableName: 'Books'
    });


  // set up the associations so we can make queries that include
  // the related objects
  Book.associate = function({ User }) {
    Book.belongsTo(User);
  };

  return Book;
};