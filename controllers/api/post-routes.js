const router = require('express').Router();
const { Post, User, Vote, Comment } = require("../../models");
const sequelize = require('../../config/connection');

router.get('/', (req, res) => {
    Post.findAll({
      order: [['created_at', 'DESC']],
      attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
      ],
      