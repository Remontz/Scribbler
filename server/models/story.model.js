const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const storySchema = new Schema(
    {
        title: {
            type: String,
            required: [true, 'title is required.'],
            minlength: [4, 'title must be at least 4 characters in length.'],
            maxlength: [36, 'title must be no more than 36 characters in length.']
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        genre: [{
            type: String,
            required: [true, 'genre is required.'],
            enum: ['Fantasy', 'Sci-Fi', 'Horror', 'Thriller', 'Mystery', 'Romance', 'Western', 'Drama', 'Action', 'Adventure', 'Children', 'Comedy', 'Crime', 'Historical', 'Biography', 'Non-Fiction', 'Poetry', 'Short Story', 'Other']
        }],
        description: {
            type: String,
            required: [true, 'description is required.'],
            minlength: [10, 'description must be at least 10 characters in length.'],
            maxlength: [120, 'description must be no more than 120 characters in length.']
        },
        content: {
            type: String,
            required: [true, 'content is required.'],
            minlength: [500, 'content must be at least 500 characters in length.']
        },
        comments: [{
            content: {
                type: String,
                minlength: [10, 'comment content must be at least 10 characters in length.']
            },
            author: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            }
        }],
    },
    { timestamps: true }
);

module.exports = mongoose.model('Story', storySchema);