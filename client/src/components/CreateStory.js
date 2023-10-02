import React, { useRef, useState, useEffect, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { HashLink as Link } from 'react-router-hash-link';
import AuthContext from '../context/AuthProvider';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';

import '../styles/create.css';
import '../styles/loadingSpinner.css';
import Nav from './sections/Nav';
import Footer from './sections/Footer';

const STORY_URL = '/stories';

const CreateStory = () => {
    const navigate = useNavigate();

    const { auth } = useContext(AuthContext);

    const [loading, setLoading] = useState(false);

    // Field States
    const [title, setTitle] = useState('');
    const [validTitle, setValidTitle] = useState(false);
    const [titleFocused, setTitleFocused] = useState(false);

    const [genre, setGenre] = useState('');
    const [validGenre, setValidGenre] = useState(false);
    const [genreFocused, setGenreFocused] = useState(false);

    const [description, setDescription] = useState('');
    const [validDescription, setValidDescription] = useState(false);
    const [descriptionFocused, setDescriptionFocused] = useState(false);

    
    const [content, setContent] = useState('');
    const [validContent, setValidContent] = useState(false);
    const [contentFocused, setContentFocused] = useState(false);

    const [author, setAuthor] = useState('');
    const [validAuthor, setValidAuthor] = useState(false);
    
    const [showContentEntry, setShowContentEntry] = useState(false);
    const [showCreateButton, setShowCreateButton] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    // Set Error Message when Field is Invalid
    useEffect(() => {
        setErrMsg('');
    }, [title, genre, description, content, author]);

    // Validate Title
    useEffect(() => {
        const result = title.length >= 4 && title.length <= 36;
        setValidTitle(result);
    }, [title]);

    // Validate Genre
    useEffect(() => {
        const result = genre.length > 0;
        setValidGenre(result);
    }, [genre]);

    // Validate Description
    useEffect(() => {
        const result = description.length >= 10 && description.length <= 120;
        setValidDescription(result);
    }, [description]);

    // Validate Author
    useEffect(() => {
        // check if author is valid
        const isValid = validAuthor || (author && author.username && author.username === 'Anonymous');
        // Check if all other fields are valid
        const allFieldsValid = validTitle && validGenre && validDescription && validContent && isValid;

        // update showCreateButton state
        setShowCreateButton(allFieldsValid);
    }, [validTitle, validGenre, validDescription, validContent, validAuthor, author])

    // Validate Content
    useEffect(() => {
        const result = content.length >= 500;
        setValidContent(result);
    }, [content]);

    
// Set Author on Component Load
useEffect(() => {
    // Function to create an anonymous user
    const createAnonymousUser = async () => {
        try {
            // Make a request to the server to create an anonymous user
            const response = await axios.post('/register', {
                username: 'Anonymous',
                password: 'Test1234!',
            });

            // Return the newly created anonymous user
            return response.data;
        } catch (err) {
            console.error(err);
            // If creating the user fails, return a placeholder user
            return {
                _id: '000000000000000000000000',
                username: 'Anonymous',
                password: 'Test1234!',
            };
        }
    };

    // Initialize the author as an anonymous user
    const initAuthor = async () => {
        let initialAuthor = await createAnonymousUser();
        // Set the author state
        setAuthor(initialAuthor);
        return initialAuthor; // Return the initial author for validation
    };

    // Function to set the author when a user is logged in
    const setLoggedInAuthor = (authorId) => {
        axios
            .get(`/users/${authorId}`)
            .then((response) => {
                console.log(`Logged in | Author: ${response.data.username}`);
                setAuthor(response.data);
            })
            .catch((err) => {
                console.error(err);
                setErrMsg('Error getting author');
                // If getting the author fails, initialize as anonymous user
                initAuthor();
            });
    };

    // If the user is logged in, set the author to the logged-in user
    if (auth !== null && auth._id && auth.user) {
        setLoggedInAuthor(auth._id);
    } else {
        // If no user is logged in, initialize the author as an anonymous user
        initAuthor().then((initialAuthor) => {
            // Check if the initial author is valid (you may need to adjust the validation criteria)
            if (initialAuthor.username === 'Anonymous') {
                // Handle validation logic here
                setValidAuthor(true);
            }
        });
    }
}, [auth]);




    // Function: Handle Show Content Entry
    const handleFieldsCompleted = () => {
        const isFieldsCompleted = title.length > 0 && genre.length > 0 && description.length > 0;
        if (isFieldsCompleted) {
            setShowContentEntry(true);
        } else {
            setErrMsg('Please fill out all fields correctly.');
        }
    };

    // Function: Handle Story Creation Success
    const handleSuccess = () => {
        setSuccess(true);

        // Scroll to top of page
        window.scrollTo(0, 0);

        setTimeout(() => {
            navigate('/home');
        }, 5000)
    }

    // Function: Handle Story Creation
    const handleCreate = async (e) => {
        e.preventDefault();

        if (!(validTitle && validGenre && validDescription && validContent && validAuthor)) {
            setErrMsg('Please fill out all fields correctly.');
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                STORY_URL,
                JSON.stringify({
                    title,
                    author, 
                    genre,
                    description,
                    content,
                }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            console.log(response.data);
            console.log('Story created successfully!')
            console.log('Title: ' + title + '\nAuthor: ' + author + '\nGenre: ' + genre + '\nDescription: ' + description + '\nContent: ' + content) 
            console.log('Redirecting to home page...')
            handleSuccess(); // Success message and redirect
        } catch (err) {
            console.error(err);
            if (!err?.response) {
                setErrMsg('Server Error');
            } else if (err.response.status === 409) {
                setErrMsg('Story already exists');
            } else if (err.response.status === 401) {
                setErrMsg('Unauthorized');
            } else if (err.response.status === 500) {
                setErrMsg('Server Error');
            } else {
                setErrMsg('Unknown Error');
            }
        } finally {
            setLoading(false);
        }
    };

    // Function: Redirect to Home Page
    const redirectToHome = () => {
        navigate('/home'); // Redirect to the home page after successful story creation
    };

    return (
        <section id="story">
            <Nav />
            {/* Error Message */}
            <p className={errMsg ? 'errmsg' : 'offscreen'} aria-live="assertive">
                {errMsg}
            </p>

            {/* Success Message */}
            <div className={`success-message ${success ? 'show' : 'hide'}`} aria-live='polite'>
                {success && (
                    <p>
                        Story created successfully! Redirecting to Home...
                        <button onClick={redirectToHome}>Go to Home</button>
                    </p>
                )}
            </div>

            {/* Loading Message */}
            {loading && (
                <div className='spinner-container'>
                    <div className='spinner'></div>
                </div>
            )}

            <h2>Create Story</h2>

            {/* Form */}
            <form onSubmit={handleCreate} className="form-container">
                {showContentEntry ? (
                    <div className="content-entry">
                        {/* ... Content Entry Fields ... */}
                        <label htmlFor="content">
                            {/* Validation Icons */}
                            <span className={validContent ? 'valid' : 'hide'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validContent || !content ? 'hide' : 'invalid'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>

                            {/* Content Entry Field */}
                            <textarea
                                type="text"
                                id="content"
                                required
                                value={content}
                                aria-invalid = {validContent ? 'false' : 'true'}
                                aria-describedby='contNote'
                                onFocus = {() => setContentFocused(true)}
                                onBlur = {() => setContentFocused(false)}
                                onChange={(e) => setContent(e.target.value)}
                            />

                            {/* Content Entry Note */}
                            <p id='contNote' className={contentFocused && content && !validContent ? 'instructions' : 'offscreen'}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Content must be at least 500 characters long. <br />
                                Current length: {content.length} characters.
                            </p>
                        </label>

                        <button type='submit' className={showCreateButton ? 'show' : 'hide'} disable={!showCreateButton}>
                            Create Story
                        </button>
                    </div>
                ) : (
                    <div className="form-fields">
                        {/* ... Form Fields ... */}
                        {/* Title */}
                        <label htmlFor='title'>
                            Title:

                            {/* Validation Icons */}
                            <span className={validTitle ? 'valid' : 'hide'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validTitle || !title ? 'hide' : 'invalid'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>

                            {/* Title Field */}
                            <input
                                type='text'
                                id='title'
                                autoFocus
                                autoCapitalize='true'
                                required
                                value={title}
                                placeholder='Title'
                                aria-invalid = {validTitle ? 'false' : 'true'}
                                aria-describedby='titleNote'
                                onFocus={() => setTitleFocused(true)}
                                onBlur={() => setTitleFocused(false)}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            {/* Title Note */}
                            <p id='titleNote' className={titleFocused && title && !validTitle ? 'instructions' : 'offscreen'}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Title must be between 4 and 36 characters. <br />
                                Current length: {title.length} characters. <br />
                                Must begin with a capital letter.
                            </p>
                        </label>

                        {/* Genre */}
                        <label htmlFor='genre'>
                            Genre:

                            {/* Validation Icons */}
                            <span className={validGenre ? 'valid' : 'hide'}>
                                <FontAwesomeIcon icon={faCheck} />
                            </span>
                            <span className={validGenre || !genre ? 'hide' : 'invalid'}>
                                <FontAwesomeIcon icon={faTimes} />
                            </span>

                            {/* Genre Field */}
                            <select
                                type='text'
                                id='genre'
                                required
                                value={genre}
                                placeholder='Genre'
                                aria-invalid = {validGenre ? 'false' : 'true'}
                                aria-describedby='genreNote'
                                onFocus={() => setGenreFocused(true)}
                                onBlur={() => setGenreFocused(false)}
                                onChange={(e) => setGenre(e.target.value)}
                            >
                                <option value='Fantasy'> Fantasy </option>
                        <option value='Sci-Fi'> Sci-Fi </option>
                        <option value='Horror'> Horror </option>
                        <option value='Thriller'> Thriller </option>
                        <option value='Mystery'> Mystery </option>
                        <option value='Romance'> Romance </option>
                        <option value='Western'> Western </option>
                        <option value='Drama'> Drama </option>
                        <option value='Action'> Action </option>
                        <option value='Adventure'> Adventure </option>
                        <option value='Children'> Children </option>
                        <option value='Comedy'> Comedy </option>
                        <option value='Crime'> Crime </option>
                        <option value='Historical'> Historical </option>
                        <option value='Biography'> Biography </option>
                        <option value='Non-Fiction'> Non-Fiction </option>
                        <option value='Poetry'> Poetry </option>
                        <option value='Short Story'> Short Story </option>
                        <option value='Other'> Other </option>
                            </select>

                            {/* Genre Note */}
                            <p id='genreNote' className={genreFocused && genre && !validGenre ? 'instructions' : 'offscreen'}>
                                <FontAwesomeIcon icon={faInfoCircle} />
                                Genre must be selected. <br />
                                Current genre: {genre}
                            </p>
                        </label>

                        {/* Description */}
                        <label htmlFor='description' className='description-label'>
                            Description:
                        </label>

                        {/* Validation Icons */}
                        <span className={validDescription ? 'valid' : 'hide'}>
                            <FontAwesomeIcon icon={faCheck} />
                            &ensp; Valid Descriptions tell the reader what to expect in the story.
                        </span>
                        <span className={validDescription || !description ? 'hide' : 'invalid'}>
                            <FontAwesomeIcon icon={faTimes} />
                            &ensp; Invalid Descriptions are too short or too long. In addition, they do not tell the reader what to expect from the story.
                        </span>

                        {/* Description Field */}
                        <textarea
                            id='description'
                            required
                            value={description}
                            placeholder='Please describe your story here...'
                            aria-invalid = {validDescription ? 'false' : 'true'}
                            aria-describedby='descNote'
                            onFocus={() => setDescriptionFocused(true)}
                            onBlur={() => setDescriptionFocused(false)}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        {/* Description Note */}
                        <p id='descNote' className={descriptionFocused && description && !validDescription ? 'instructions' : 'offscreen'}>
                            <FontAwesomeIcon icon={faInfoCircle} />
                            Description must be between 10 and 120 characters. <br />
                            Current length: {description.length} characters. <br />
                            Letters, Numbers, Underscores, Spaces, Hyphens, and Punctuation are allowed.
                        </p>

                        <button
                            type="button"
                            onClick={handleFieldsCompleted}
                            className={
                                validTitle && validGenre && validDescription
                                    ? 'show-button'
                                    : 'hide-button'
                            }
                        >
                            Start Writing as {auth.user ? author.username : 'Anonymous'}
                        </button>
                    </div>
                )}
            </form>
            
            <span>Written by {auth.user ? author.username : 'Anonymous'}</span>
            <Footer />
        </section>
    );
};

export default CreateStory;
