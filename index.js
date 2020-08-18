const express = require('express')
const Sequelize = require("sequelize");
const session = require("express-session");
 
// initalize sequelize with session store
const SequelizeStore = require("connect-session-sequelize")(session.Store);
 
// create database, ensure 'sqlite3' in your package.json
const sequelize = new Sequelize("database", "username", "password", {
  dialect: "sqlite",
  storage: "./session.sqlite",
});
 
// configure express
const app = express();
app.use(
  session({
    secret: "keyboard cat",
    store: new SequelizeStore({
      db: sequelize,
    }),
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true, // if you do SSL outside of node.
  })
);
// continue as normal

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

