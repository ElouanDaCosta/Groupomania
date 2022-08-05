const db = require('./models')
const bcrypt = require('bcrypt')

const User = db.user

//sync the db and create an admin user
db.sequelize.sync({force : true}).then((err) => {
  if (err) {
    console.log(err)
  }

  bcrypt.hash('hL1xV4bQ8kU8dM1s', 10).then((hash) => {
    const user = User.build({
      name: 'admin',
      email: 'admin@mail.com',
      isAdmin: 1,
      password: hash
    });
    user.save()
    .then(() => {
      console.log('Database synced')
      process.exit(0)
    })
    .catch((err) => {
      console.log('Erreur à la création de l\'admin')
      process.exit(0)
    })
  })
})