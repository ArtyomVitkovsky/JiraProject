const db = require('./models');

db.sequelize.sync({ alter: true })
    .then(() => console.log('Database synced!'))
    .catch(e => console.log(e)); 