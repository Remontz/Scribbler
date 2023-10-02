import React, {useState, useEffect, useRef, useContext} from 'react'
import {faCheck, faTimes, faInfoCircle} from '@fortawesome/free-solid-svg-icons'
import { HashLink as Link } from 'react-router-hash-link';
import AuthContext from '../context/AuthProvider';
import { useParams } from 'react-router-dom'
import axios from '../api/axios';
import Nav from './sections/Nav';
import Footer from './sections/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const STORY_URL = '/stories/'

const EditStory = () => {
    const { storyId } = useParams();

    const titleRef = useRef(null);
    const errorRef = useRef(null);
    const {auth} = useContext(AuthContext);

    const [story, setStory] = useState({});

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

    const [authorName, setAuthorName] = useState('');
    const [validAuthorName, setValidAuthorName] = useState(false);
    const [authorNameFocused, setAuthorNameFocused] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    // Set Focus when component loads
    useEffect(() => {
        titleRef.current.focus();
    }, [])

    // Set Error Message
    useEffect(() => {
        setErrMsg('')
    }, [title, genre, description, content, authorName])

    // Validate Title
    useEffect(() => {
        const result = title.length >= 4 && title.length <= 36;
        setValidTitle(result);
    }, [title])

    // Validate Genre
    useEffect(() => {
        const result = genre.length > 0;
        setValidGenre(result);
    }, [genre])

    // Validate Description
    useEffect(() => {
        const result = description.length >= 10 && description.length <= 120;
        setValidDescription(result);
    }, [description])

    // Validate Author Name
    useEffect(() => {
        const result = authorName.length >= 4 && authorName.length <= 36;
        setValidAuthorName(result);
    }, [authorName])

    // Validate Content
    useEffect(() => {
        const result = content.length >= 500;
        setValidContent(result);
    }, [content])

    // Get Story & Author Name
    useEffect(() => {
        const fetchAuthorName = (authorId) => {
            story.author !== null && story.author === authorId
            ? axios.get(`/users/${authorId}`)
            .then((res) => {
                console.log(`Author Name Response: ${res.data.username}`)
                setAuthorName(res.data.username)
            })
            .catch((err) => console.log(err))
            : console.log('Author Name not found')
        }
        axios.get(STORY_URL + storyId)
        .then((res) => {
            console.log(`Story: ${res.data}`)
            setStory(res.data)
            fetchAuthorName(res.data.author)
        })
        .catch((err) => console.log(err))
    }, [storyId, story.author])

    // alert on successful edit
    useEffect(() => {
        if (success) {
            alert('Story successfully edited!')
            setSuccess(false)
        }
    }, [success])

    // Handle Edit Submit
    const handleEdit = async (e) => {
        e.preventDefault()
        console.log('Edit Story Submitted')
        if(!(validTitle && validGenre && validAuthorName && validDescription && validContent)) {
            setErrMsg('Please fill out all fields correctly.')
            return
        }
        try {
            const res = await axios.put(STORY_URL + storyId,
                JSON.stringify({title, authorName, genre, description, content}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true
                }
                )
            console.log(res.data)
            console.log(JSON.stringify(res))
            console.log('Story successfully edited!')
            console.log('Title: ' + title + 'By: ' + authorName)
            setSuccess(true)
        } catch (err) {
            console.log(err)
            if(!err?.response) {
                setErrMsg('Server Error')
            } else if(err.response?.status === 401) {
                setErrMsg('You must be logged in to edit a story.')
            } else if(err.response?.status === 403) {
                setErrMsg('You do not have permission to edit this story.')
            } else {
                setErrMsg('Unknown Error' + err.response?.status)
            }
            errorRef.current.focus()
        }
    }

  return (
    <section id='edit-story'>
        <Nav />
        <p ref={errorRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'>
            {errMsg}
        </p>
        <h1>Edit {story.title}</h1>

        <form className='form-container' /* onSubmit = {handleEdit} */ >
            <div className = 'form-fields'>
                {/* Title Field */}
                <label htmlFor='title'>
                    Title:

                    {/* Validation Icons */}
                    <span className={validTitle ? 'valid' : 'hide'}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validTitle || !title ? 'hide' : 'invalid'}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>

                    {/* Title Input */}
                    <input
                        type='text'
                        id='title'
                        ref={titleRef}
                        required
                        value={title}
                        placeholder = {story.title}
                        aria-invalid = {validTitle ? 'false' : 'true'}
                        aria-describedby='titleNote'
                        onFocus={() => setTitleFocused(true)}
                        onBlur={() => setTitleFocused(false)}
                    />

                    {/* Title Note */}
                    < p id='titleNote' className={titleFocused && title && !validTitle ? 'instructions' : 'offscreen'} >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Title must be between 4 and 36 characters. <br />
                        Current title: {story.title} <br />
                        Must begin with a capital letter. <br />
                        Letters, Numbers, Underscores, and Hyphens allowed. <br />
                    </p>
                </label>

                {/* Genre Field */}
                <label htmlFor='genre'>
                    Genre:

                    {/* Validation Icons */}
                    <span className={validGenre ? 'valid' : 'hide'}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validGenre || !genre ? 'hide' : 'invalid'}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>

                    {/* Genre Input */}
                    <select
                    type='text'
                    id='genre'
                    onChange={(e) => setGenre(e.target.value)}
                    required
                    value={genre}
                    aria-invalid={validGenre ? 'false' : 'true'}
                    aria-describedby='genreNote'
                    onFocus={() => setGenreFocused(true)}
                    onBlur={() => setGenreFocused(false)}>
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
                    < p id='genreNote' className={genreFocused && genre && !validGenre ? 'instructions' : 'offscreen'} >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Genre must be at least 1 character. <br />
                        Current genre: {story.genre} <br />
                        Letters, Numbers, Underscores, and Hyphens allowed. <br />
                    </p>
                </label>
                    
                {/* Description Field */}
                <label htmlFor='description'>
                    Description:

                    {/* Validation Icons */}
                    <span className={validDescription ? 'valid' : 'hide'}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validDescription || !description ? 'hide' : 'invalid'}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>

                    {/* Description Input */}
                    <textarea
                        id='description'
                        required
                        value={description}
                        placeholder = {story.description}
                        aria-invalid = {validDescription ? 'false' : 'true'}
                        aria-describedby='descriptionNote'
                        onFocus={() => setDescriptionFocused(true)}
                        onBlur={() => setDescriptionFocused(false)}
                    />

                    {/* Description Note */}
                    < p id='descriptionNote' className={descriptionFocused && description && !validDescription ? 'instructions' : 'offscreen'} >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Description must be between 10 and 120 characters. <br />
                        Current description: {story.description} <br />
                        Letters, Numbers, Underscores, and Hyphens allowed. <br />
                    </p>
                </label>

                {/* Author Field */}
                <label htmlFor='author'>
                    Author:

                    {/* Validation Icons */}
                    <span className={validAuthorName ? 'valid' : 'hide'}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>

                    {/* Author Input */}
                    <input
                        type='text'
                        id='author'
                        required
                        value={authorName}
                        placeholder = {story.author}
                        aria-invalid = {validAuthorName ? 'false' : 'true'}
                        aria-describedby='authorNote'
                        onFocus={() => setAuthorNameFocused(true)}
                        onBlur={() => setAuthorNameFocused(false)}
                    />

                    {/* Author Note */}
                    < p id='authorNote' className={authorNameFocused && authorName && !validAuthorName ? 'instructions' : 'offscreen'} >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Author must be between 4 and 36 characters. <br />
                        Current author: {authorName} <br />
                        Only Letters & Spaces allowed. <br />
                    </p>
                </label>

                {/* Content Field */}
                <label htmlFor='content'>
                    Content:

                    {/* Validation Icons */}
                    <span className={validContent ? 'valid' : 'hide'}>
                        <FontAwesomeIcon icon={faCheck} />
                    </span>
                    <span className={validContent || !content ? 'hide' : 'invalid'}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>

                    {/* Content Input */}
                    <textarea
                        id='content'
                        required
                        value={content}
                        placeholder = {story.content}
                        aria-invalid = {validContent ? 'false' : 'true'}
                        aria-describedby='contentNote'
                        onFocus={() => setContentFocused(true)}
                        onBlur={() => setContentFocused(false)}
                    />

                    {/* Content Note */}
                    < p id='contentNote' className={contentFocused && content && !validContent ? 'instructions' : 'offscreen'} >
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Content must be at least 500 characters. <br />
                        Current content: {story.content} <br />
                        Letters, Numbers, Underscores, and Hyphens allowed. <br />
                    </p>
                </label>
            </div>
        </form>

        <Footer />
    </section>
  )
}

export default EditStory