const express = require('express');
const request = require('request');
const config = require('config');
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');
//models
const User = require('../../models/User');
const Profile = require('../../models/Profile');
const Post = require('../../models/Post');

// @route POST api/profile/
// @desc Create/Update User Profile
// @access Private

router.post('/', [auth, [
    check('status', 'Status is required').not().isEmpty(),
    check('skills', 'Skills is required').not().isEmpty()
]], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        company,
        website,
        location,
        bio,
        status,
        githubusername,
        skills,
        youtube,
        facebook,
        twitter,
        instagram,
        linkedin
    } = req.body;

    //Build Profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;

    if (skills) {
        profileFields.skills = skills.split(',').map(a => a.trim());
    }

    //Build Social object
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (twitter) profileFields.social.twitter = twitter;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    //Create/Update Data to DB
    try {
        //await use because we send to mongoose and send promise
        let profile = await Profile.findOne({ user: req.user.id });

        if (profile) {
            //Update
            profile = await Profile.findOneAndUpdate(
                { user: req.user.id },
                { $set: profileFields },
                { new: true }
            );

            return res.json(profile);
        }

        //Create
        profile = new Profile(profileFields);

        await profile.save();
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

})

// @route GET api/profile/me
// @desc Get Current users Profile
// @access Private

//whenever routes need to be protected add auth
router.get('/me', auth, async (req, res) => {
    try {
        //get user id from auth middleware then populate the data from user db
        const profile = await Profile.findOne({ user: req.user.id }).populate({ model: "User", path: 'user', select: ['name', 'avatar'] });
        if (!profile) {
            return res.status(400).json({ msg: 'There is no profile for this user' });
        }
        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error : ' + err.message)
    }
});

// @route GET api/profile
// @desc Get All profiles
// @access Public
router.get('/', async (req, res) => {
    try {
        const profiles = await Profile.find().populate({ model: "User", path: 'user', select: ['name', 'avatar'] });
        res.json(profiles);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

// @route GET api/profile/user/:user_id
// @desc Get profile by user ID
// @access Public
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate({ model: "User", path: 'user', select: ['name', 'avatar'] });
        if (!profile) return res.status(400).json({ msg: "Profile not Found" });

        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        if (err.kind == 'ObjectId') {
            return res.status(400).json({ msg: "Profile not Found" });
        }
        res.status(500).json("Server Error");
    }
})

// @route DELETE api/profile
// @desc Delete profile, user & posts
// @access Private

router.delete('/', auth, async (req, res) => {
    try {
        // Remove users posts
        await Post.deleteMany({ user: req.user.id });
        // Remove profile
        await Profile.findOneAndRemove({ user: req.user.id });
        // Remove user
        await User.findOneAndRemove({ _id: req.user.id });

        res.json({ msg: 'User deleted' });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

// @route PUT api/profile/experience
// @desc add profile experience
// @access Private

router.put('/experience', [auth, [
    check('title', 'Title is Required').not().isEmpty(),
    check('company', 'Company is Required').not().isEmpty(),
    check('from', 'From date is Required').not().isEmpty()
]], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //unshift same as push just the most recent are first
        profile.experience.unshift(newExp);

        await profile.save();

        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route DELETE api/profile/experience/:exp_id
// @desc Delete experience from profile
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get profile index based on id
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id);

        //Remove profile based on index
        profile.experience.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

// @route PUT api/profile/education
// @desc add profile education
// @access Private

router.put('/education', [auth, [
    check('school', 'School is Required').not().isEmpty(),
    check('degree', 'Degree is Required').not().isEmpty(),
    check('field', 'Field is Required').not().isEmpty(),
    check('from', 'From date is Required').not().isEmpty()
]], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() });
    }

    const {
        school,
        degree,
        field,
        from,
        to,
        current,
        description
    } = req.body;

    const newEdu = {
        school,
        degree,
        field,
        from,
        to,
        current,
        description
    }

    try {
        const profile = await Profile.findOne({ user: req.user.id });
        //unshift same as push just the most recent are first
        profile.education.unshift(newEdu);

        await profile.save();

        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
})

// @route DELETE api/profile/education/:edu_id
// @desc Delete education from profile
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id });

        //Get profile index based on id
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id);

        //Remove profile based on index
        profile.education.splice(removeIndex, 1);

        await profile.save();

        res.json(profile);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

// @route GET api/profile/github/:username
// @desc Get user repos from Github
// @access Public

router.get('/github/:username', (req, res) => {
    try {
        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'House-App' }
        }
        request(options, (error, response, body) => {
            if (error) console.error(error);
            if (response.statusCode !== 200) {
                res.status(404).json({ msg: 'No Github Profile Found' });
            }
            res.json(JSON.parse(body));
        })
    }
    catch (err) {
        console.error(err.message);
        res.status(500).json("Server Error");
    }
})

module.exports = router;