// Update with your config settings.
require('dotenv').config();
module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres://localhost/aliens'
  }, production: {
    client: 'pg',
    connection: process.env.DATABASE_URL + '?ssl=true'
  }

};
