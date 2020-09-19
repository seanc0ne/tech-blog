const router = require('express').Router();
const { Post, User, Comment } = require('../models');

//show all posts
router.get('/', (req, res) => {
    Post.findAll({
        attributes: [
            'id',
            'content',
            'title',
            'created_at'
        ],
        order: [['created_at', 'DESC']],
        include: [
            {
                model: Comment, 
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                order: [['created_at', 'DESC']],
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
    }).then((dbPostData) => {
        console.log('test');
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

//show single post
router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'content',
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
                    'created_at'
                ],
                order: [['created_at', 'DESC']],
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
    .then((dbPostData) => {
        if (!dbPostData) {
            res.status(404).json({ message: 'NO POST FOUND W THIS ID'})
            return;
        }

        const post = dbPostData.get({ plain: true });

        res.render('post', {
            post,
            loggedIn: req.session.loggedIn
        });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json(err);
    });
});

//show login page
router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});

//show signup
router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('signup');
});

module.exports = router;
