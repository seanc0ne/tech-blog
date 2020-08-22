const path = require('path');
const express = require('express')
const session = require('express-session');
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3001;

// create database
const sequelize = require('./config/connection');

// initalize sequelize with session store
const SequelizeStore = require("connect-session-sequelize")(session.Store);
 
const sess = {
  secret: "Diarrhea at Barnes and Noble",
  cookie: {}, 
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};

app.use(session(sess));

const hbs = exphbs.create({
  helpers: {
    format_date: date => {
      return `${date.getMonth() + 1}/${date.getDate()}/${date.getYear()}`;
    }
  }
});
 
// configure express
const app = express();
const myStore = new SequelizeStore({
    db: sequelize,
  });
app.use(
  session({
    secret: "keyboard cat",
    store: myStore,
    resave: false, // we support the touch method so per the express-session docs this should be set to false
    proxy: true, // if you do SSL outside of node.
  })
);
// continue as normal

myStore.sync();

const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Access the session as req.session
app.get('/counter', function(req, res, next) {
    if (req.session.views) {
      req.session.views++
      res.setHeader('Content-Type', 'text/html')
      res.write('<p>views: ' + req.session.views + '</p>')
      res.write('<p>expires in: ' + (req.session.cookie.maxAge / 1000) + 's</p>')
      res.end()
    } else {
      req.session.views = 1
      res.end('welcome to the session demo. refresh!')
    }
  })

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

