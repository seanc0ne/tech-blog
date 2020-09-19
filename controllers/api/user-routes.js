const router = require("express").Router();
const { User, Post, Comment } = require("../../models");
const withAuth = require('../../utils/auth');

//get all users
router.get('/', (req, res) => {
    User.findAll()
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//get single user
router.get('/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        },
        attributes: { exclude: ['password']},
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'created_at']
            },
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'USER NOT FOUND' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

//create user
router.post('/', (req, res) => {
    User.create(req.body)
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.id;
        req.session.username = dbUserData.username;
        req.session.loggedIn = true;
        res.json(dbUserData);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//login user
router.post('/login', (req, res) => {
    User.findOne({
      where: {
        username: req.body.username
      }
    })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(400).json({ message: 'USER NOT FOUND' });
        return;
      }
      // verify user identity
      dbUserData.checkPassword(req.body.password).then(result => {
        if (!result) {
          res.status(400).json({ message: 'PASSWORD INCORRECT' });
          return;
        }
        req.session.save(() => {
          // declare session variables
          req.session.user_id = dbUserData.id;
          req.session.username = dbUserData.username;
          req.session.loggedIn = true;
          res.json({ user: dbUserData, message: 'LOGGED IN' });
        });
      });
    });
  });

//user logout
router.post('/logout', (req, res) => {
	if (req.session.loggedIn) {
		req.session.destroy(() => {
			res.status(204).end();
		});
	} else {
		res.status(404).end();
	}
});

//update user
router.put('/:id', withAuth, (req, res) => {
    User
      .update(req.body, {
        individualHooks: true,
        where: {
          id: req.params.id
        }
      })
      .then(dbUserData => {
        if (!dbUserData[0]) {
          res.status(404).json({ message: 'USER NOT FOUND' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
});

//delete user
router.delete('/:id', withAuth, (req, res) => {
    User
      .destroy({
        where: {
          id: req.params.id
        }
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'USER NOT FOUND' });
          return;
        }
        res.json(dbUserData);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

module.exports = router;