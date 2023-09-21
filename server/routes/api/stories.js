const express = require('express');
const router = express.Router();
const storiesController = require('../../controllers/story.controller');


router.route('/')
    .get(storiesController.getAllStories)
    .post(storiesController.createStory)
    .put(storiesController.updateStory)
    .delete(storiesController.deleteStory);

router.route('/:id')
    .get(storiesController.getStory);

module.exports = router;