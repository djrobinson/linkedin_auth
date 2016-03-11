// Update with your config settings.

module.exports = {

  development: {
    client: 'sqlite3',
    connection: 'postgres://localhost/brewpubs'
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL
  }

};
