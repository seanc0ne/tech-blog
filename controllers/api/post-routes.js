const router = require('express').Router();
const { Post, User, Comment } = require("../../models");
const withAuth = require('../../utils/auth');

//get all posts
router.get('/', (req, res) => {
    Post.findAll({
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'content',
        'title',
        'created_at',
      ],
      include: [
        {
            model: Comment,
            attributes: ['comment_text', 'created_at'],
            include: {
              model: User,
              attributes: ['username']
            }
          },
          {
            model: User,
            attributes: ['username']
          }
        ]
       })
          .then(dbPostData => res.json(dbPostData))
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      });

//get single post
router.get('/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'content',
            'title',
            'created_at',
        ],
        include: [
            {
              model: User,
              attributes: ['username']
            },
            {
              model: Comment,
              attributes: ['comment_text', 'created_at'],
              include: {
                model: User,
                attributes: ['username']
              },
              order: [['created_at', 'DESC']]
            }
          ]
        })
          .then(dbPostData => {
            if (!dbPostData) {
              res.status(404).json({ message: 'POST NOT FOUND' });
              return;
            }
            res.json(dbPostData);
          })
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    });

//create a post
router.post('/', withAuth, (req, res) => {
    Post.create({
        title: req.body.title,
        content: req.body.content,
        user_id: req.session.user_id
        })
        .then(dbPostData => res.json(dbPostData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
    });

//update a post
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title,
            content: req.body.content
        },
        {
            where: {
                  id: req.params.id
            }
        }
            )
              .then(dbPostData => {
                if (!dbPostData) {
                  res.status(404).json({ message: 'POST NOT FOUND' });
                  return;
                }
                res.json(dbPostData);
              })
              .catch(err => {
                console.log(err);
                res.status(500).json(err);
              });
          });

//delete post
router.delete('/id:', withAuth, (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(dbPostData => {
    if (!dbPostData) {
      res.status(404).json({ message: "POST NOT FOUND"});
      return;
    }
    res.json(dbPostData);
  })
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

module.exports = router;