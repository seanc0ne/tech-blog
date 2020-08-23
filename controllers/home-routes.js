const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', (req, res) => {
    Post.findAll({
        // attributes: [
        //     'id',
        //     'post_content',
        //     'title',
        //     'created_at'
        // ],
        // order: [['created_at', 'DESC']],
        include: [
            User
            // {
            //     model: Comment, 
            //     attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
            //     include: {
            //         model: User,
            //         attributes: ['username']
            //     }
            // },
            // {
            //     model: User,
            //     attributes: ['username']
            // }
        ]
    }).then((dbPostData) => {
        console.log('test');
        const posts = dbPostData.map((Post) => Post.get({ plain: true }));
        res.render('all-posts', {
            posts,
            // loggedIn: req.session.loggedIn
        });
    })
    // .catch((err) => {
    //     console.log(err);
    //     res.status(500).json(err);
    // });
});

router.get('/post/:id', (req, res) => {
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
                    'created_at'
                ],
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

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login');
});


module.exports = router;

// links to sign up and sign in
// api for retrieving posts (get all posts)
// new post API for a comment
// anon user view 

