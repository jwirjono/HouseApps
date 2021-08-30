const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const auth = require('../../middleware/auth');
const Post = require('../../models/Post');
const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route POST api/posts
// @desc Create a post
// @access Private

router.post('/', [auth, [
    check('text', 'Text is required').not().isEmpty()
]],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');

            const newPost = new Post({
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            });

            const post = await newPost.save();

            res.json(post);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    });

// @route DELETE api/posts
// @desc Delete a  post
// @access Private

router.delete('/:id', auth, async (req, res) => {
    try {
        //most recent first
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not Found" });
        }

        //Check user
        if (post.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await post.remove();

        res.json({ msg: "Post Removed" });
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not Found" });
        }
        res.status(500).send('Server Error');
    }
})

// @route GET api/posts
// @desc Get all post
// @access Private(must be login first)

router.get('/', auth, async (req, res) => {
    try {
        //most recent first
        const posts = await Post.find().sort({ date: -1 });
        res.json(posts);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route GET api/posts/:id
// @desc Get post by id
// @access Private(must be login first)

router.get('/:id', auth, async (req, res) => {
    try {
        //most recent first
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ msg: "Post not Found" });
        }

        res.json(post);
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not Found" });
        }
        res.status(500).send('Server Error');
    }
})


// LIKES


// @route PUT api/posts/like/:id
// @desc Like a post
// @access Private

router.put('/like/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //check post has been liked , Filter Empty if none
        if (post.likes.filter(a => a.user.toString() === req.user.id).length > 0) {
            return res.status(400).json({ msg: "Post has been liked" });
        }

        post.likes.unshift({ user: req.user.id });

        await post.save();

        res.json(post.likes);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route PUT api/posts/unlike/:id
// @desc Unlike a post
// @access Private

router.put('/unlike/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        //check post has been liked , Filter Empty if none
        if (post.likes.filter(a => a.user.toString() === req.user.id).length === 0) {
            return res.status(400).json({ msg: "Post has not yet liked" });
        }

        //Get Remove Index
        const removeIndex = post.likes.map(a => a.user.toString()).indexOf(req.user.id);

        post.likes.splice(removeIndex, 1);

        await post.save();

        res.json(post.likes);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route POST api/posts/comment/:id
// @desc Comment on a post
// @access Private

router.post('/comment/:id', [auth, [
    check('text', 'Text is required').not().isEmpty()
]],
    async (req, res) => {
        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ error: error.array() });
        }

        try {
            const user = await User.findById(req.user.id).select('-password');
            const post = await Post.findById(req.params.id);

            const newComment = {
                text: req.body.text,
                name: user.name,
                avatar: user.avatar,
                user: req.user.id
            }

            post.comments.unshift(newComment);

            await post.save();

            res.json(post.comments);
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }

    });

// @route DELETE api/posts/comment/:id
// @desc Delete a Comment
// @access Private

router.delete('/comment/:id/:comment_id', auth, async (req, res) => {
    try {
        //most recent first
        const post = await Post.findById(req.params.id);
        //because it is a list dumbass it cannot do this
        //const comment = await Post.comments.findById(req.params.comment_id);

        const comment = post.comments.find(a => a.id === req.params.comment_id);
        console.log(comment);

        if (!post) {
            return res.status(404).json({ msg: "Post not Found" });
        }

        if (!comment) {
            return res.status(404).json({ msg: "Comment not Found" });
        }

        //Check user
        if (comment.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }


        const removeIndex = post.comments.map(a => a._id.toString()).indexOf(req.params.comment_id);
        console.log(removeIndex);

        post.comments.splice(removeIndex, 1);

        await post.save();

        res.json(post.comments);
    }
    catch (err) {
        console.error(err.message);
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "Post not Found" });
        }
        res.status(500).send('Server Error');
    }
})



module.exports = router;