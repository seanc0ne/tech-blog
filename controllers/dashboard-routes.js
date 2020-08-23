const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const userAuth = require('../utils/auth');

router.get('/', userAuth, (req, res) => {
    Post.findAll({
        where: {
            user_id: req.session.user_id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at'
        ],
        include: [
            {
              model: Comment,
              attributes: [
                'id', 
                'comment_text', 
                'post_id', 
                'user_id', 
                'created_at'],
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
        .then(dbPostData => {
            const posts = dbPostData.map(Post => Post.get({ plain: true}));
            res.render('dashboard', {
                posts,
                loggedIn: true
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/edit/:id', userAuth, (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at'
        ],
        include: [
            {
                model: Comment,
                attributes: [
                    'id',
                    'comment_text',
                    'post_id',
                    'user_id',
                    'created_at'],
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
    .then(dbPostData => {
        const post = dbPostData.get({ plain: true });
        console.log('THIS IS POST: ', post)
        res.render('edit-blog-post', {
            post,
            loggedIn: true
        })
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});
  
module.exports = router;

// when logged in
// creation
// editing capabilities
// delete


