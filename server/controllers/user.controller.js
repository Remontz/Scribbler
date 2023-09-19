const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    if (!users) return res.status(204).json({ 'message': 'No users found' });
    res.json(users);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.body.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.body.id} not found` });
    }
    const result = await user.deleteOne({ _id: req.body.id });
    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": 'User ID required' });
    const user = await User.findOne({ _id: req.params.id }).exec();
    if (!user) {
        return res.status(204).json({ 'message': `User ID ${req.params.id} not found` });
    }
    res.json(user);
}

const updateUser = async (req, res) => {
    const { _id, username, email, password, roles, library, favorites, ownedWork, friends } = req.body
    if(!id) { return res.status(400).json({'message' : 'User ID required.'}) }

    const user = await User.findOne({_id}).exec()
    if(!user) { return res.status(204).json({ 'message': `User ID ${req.body.id} not found` }) }
    
    if(username) { user.username = username }
    if(email) { user.email = email }
    if(password) { user.password = password }
    if(roles) { user.roles = roles }
    if(library) { user.library = library }
    if(favorites) { user.favorites = favorites }
    if(ownedWork) { user.ownedWork = ownedWork }
    if(friends) { user.friends = friends }

    const result = await user.save()
    res.json(result)
}

module.exports = {
    getAllUsers,
    deleteUser,
    getUser,
    updateUser
}