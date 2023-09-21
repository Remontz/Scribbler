const Story = require('../models/story.model');

const getAllStories = async (req, res) => {
    const stories = await Story.find();
    if (!stories) return res.status(204).json({ 'message': 'No stories found' });
    res.json(stories);
}

const getStory = async (req, res) => {
    if(!req?.params?.id) return res.status(400).json({ "message": 'Story ID required' });
    const story = await Story.findOne({_id: req.params.id}).exec();
    if(!story) {
        return res.status(204).json({ 'message': `Story ID ${req.params.id} not found` });
    }
    res.json(story);
}

const createStory = async (req, res) => {
    const { title, author, genre, description, content } = req.body;
    if(!title) { return res.status(400).json({ 'message': 'Story title required.' }) }
    if(!author) { return res.status(400).json({ 'message': 'Story author required.' }) }
    if(!genre) { return res.status(400).json({ 'message': 'Story genre required.' }) }
    if(!description) { return res.status(400).json({ 'message': 'Story description required.' }) }
    if(!content) { return res.status(400).json({ 'message': 'Story content required.' }) }

    const story = new Story({ title, author, genre, description, content });
    const result = await story.save();
    res.json(result);
}

const updateStory = async (req, res) => {
    const { _id, title, author, genre, description, content, comments } = req.body;
    if(!_id) { return res.status(400).json({ 'message': 'Story ID required.' }) }

    const story = await Story.findOne({_id}).exec();
    if(!story) { return res.status(204).json({ 'message': `Story ID ${req.body.id} not found` }) }

    if(title) { story.title = title }
    if(author) { story.author = author }
    if(genre) { story.genre = genre }
    if(description) { story.description = description }
    if(content) { story.content = content }
    if(comments) { story.comments = comments }

    const result = await story.save();
    res.json(result);
}

const deleteStory = async (req, res) => {
    if(!req?.body?.id) return res.status(400).json({ "message": 'Story ID required' });
    const story = await Story.findOne({_id: req.body.id}).exec();
    if(!story) {
        return res.status(204).json({ 'message': `Story ID ${req.body.id} not found` });
    }
    const result = await story.deleteOne({_id: req.body.id});
    res.json(result);
}

module.exports = {
    getAllStories,
    getStory,
    createStory,
    updateStory,
    deleteStory
}