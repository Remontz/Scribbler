import React, { useRef, useState, useEffect, useContext } from 'react'
import { faCheck, faTimes, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { HashLink as Link } from 'react-router-hash-link/dist/react-router-hash-link.cjs.production'
import axios from '../api/axios'
import AuthContext from '../context/AuthProvider'

import '../styles/login.css'
import Nav from './sections/Nav'
import Footer from './sections/Footer'

const STORY_URL = '/stories'

const CreateStory = () => {
    const titleRef = useRef()
    const errRef = useRef()
    const { auth } = useContext(AuthContext)
    const [author, setAuthor] = useState()

    //Field States
    const [title, setTitle] = useState('')
    const [validTitle, setValidTitle] = useState(false)
    const [titleFocus, setTitleFocus] = useState(false)

    const [genre, setGenre] = useState('')
    const [validGenre, setValidGenre] = useState(false)
    const [genreFocus, setGenreFocus] = useState(false)

    const [description, setDescription] = useState('')
    const [validDescription, setValidDescription] = useState(false)
    const [descriptionFocus, setDescriptionFocus] = useState(false)

    const [content, setContent] = useState('')
    const [validContent, setValidContent] = useState(false)
    const [contentFocus, setContentFocus] = useState(false)

    const [errMsg, setErrMsg] = useState('')
    const [success, setSuccess] = useState(false)

    // Set Focus when component loads
    useEffect(() => {
        titleRef.current.focus()
    }, [])

    // Set Error Message whenever fields change
    useEffect(() => {
        setErrMsg('')
    }, [title, genre, description, content])

    // Validate Title
    useEffect(() => {
        const result = title.length >= 4 && title.length <= 36
        setValidTitle(result)
    }, [title])

    // Validate Genre
    useEffect(() => {
        const result = genre.length > 0
        setValidGenre(result)
    }, [genre])

    // Validate Description
    useEffect(() => {
        const result = description.length >= 10 && description.length <= 120
        setValidDescription(result)
    }, [description])

    // Validate Content
    useEffect(() => {
        const result = content.length >= 500
        setValidContent(result)
    }, [content])

    useEffect(() => {
        const fetchAuthor = async () => {
            console.log(auth)
            console.log(auth._id)
            console.log(auth.accessToken)
            try {
                const response = await axios.get(`/users/${auth._id}`, { 
                    headers: {
                        Authorization: `Bearer ${auth.accessToken}`,
                    },
                })
                setAuthor(response.data.author.username) // Assuming the author data is in response.data
            } catch (error) {
                console.error("Error fetching author:", error)
                // Handle the error as needed

            }
        };
    
        if (auth) {
            fetchAuthor();
        }
    }, [auth]);
    
    // alert success
    useEffect(() => {
        if (success) {
            alert('Story created successfully!')
            setSuccess(false)
        }
    }, [success])

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!validTitle || !validGenre || !validDescription || !validContent) {
            setErrMsg('Please fill out all fields correctly.')
            return
        }
        try {
            const response = await axios.post(`/stories`,
                JSON.stringify({title, author, genre, description, content}),
                {
                    headers: {'Content-Type': 'application/json'},
                    withCredentials: true,
                }
            )
            console.log(response.data)
            console.log(response.accessToken)
            console.log(JSON.stringify(response))
            setSuccess(true)
            setTitle('')
            setGenre('')
            setDescription('')
            setContent('')
        } catch (err) {
            console.log(err)
            if(!err?.response) {
                setErrMsg('Server Error')
            } else if(err.response?.status === 409) {
                setErrMsg('Story already exists')
            } else if(err.response?.status === 401) {
                setErrMsg('Unauthorized')
            } else if(err.response?.status === 500) {
                setErrMsg('Server Error')
            } else {
                setErrMsg('Unknown Error')
            }
            errRef.current.focus()
        } 
        }

  return (
    <section id='story'>
        <Nav />
        <p ref={errRef} className={errMsg ? 'errmsg' : 'offscreen'} aria-live='assertive'> {errMsg} </p>
        <form onSubmit={handleCreate}>
            <label htmlFor='title'>
                Title:
                <span className={validTitle ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validTitle || !title ? 'hide' : 'invalid'}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>

                <input
                    type='text'
                    id='title'
                    ref={titleRef}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    value={title}
                    aria-invalid={validTitle ? 'false' : 'true'}
                    aria-describedby='titnote'
                    onFocus={() => setTitleFocus(true)}
                    onBlur={() => setTitleFocus(false)}
                />
                <p id='titnote' className={titleFocus && title && !validTitle ? 'instructions' : 'offscreen'}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    4 to 36 characters.<br />
                    Must begin with a letter. <br />
                    Letters, numbers, underscores, hyphens allowed.
                </p>
            </label>

            <label htmlFor='genre'>
                Genre:
                <span className={validGenre ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validGenre || !genre ? 'hide' : 'invalid'}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>

                <select
                    type='text'
                    id='genre'
                    onChange={(e) => setGenre(e.target.value)}
                    required
                    value={genre}
                    aria-invalid={validGenre ? 'false' : 'true'}
                    aria-describedby='gennote'
                    onFocus={() => setGenreFocus(true)}
                    onBlur={() => setGenreFocus(false)}>
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
                <p id='gennote' className={genreFocus && genre && !validGenre ? 'instructions' : 'offscreen'}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    Select a genre from the dropdown menu.
                </p>
            </label>

            <label htmlFor='description'>
                Description:
                <span className={validDescription ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validDescription || !description ? 'hide' : 'invalid'}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>

                <textarea
                    type='text'
                    id='description'
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    value={description}
                    aria-invalid={validDescription ? 'false' : 'true'}
                    aria-describedby='descnote'
                    col='30'
                    row='5'
                    onFocus={() => setDescriptionFocus(true)}
                    onBlur={() => setDescriptionFocus(false)}
                />
                <p id='descnote' className={descriptionFocus && description && !validDescription ? 'instructions' : 'offscreen'}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    10 to 120 characters.<br />
                </p>
            </label>

            <label htmlFor='content'>
                Content:
                <span className={validContent ? 'valid' : 'hide'}>
                    <FontAwesomeIcon icon={faCheck} />
                </span>
                <span className={validContent || !content ? 'hide' : 'invalid'}>
                    <FontAwesomeIcon icon={faTimes} />
                </span>

                <textarea
                    type='text'
                    id='content'
                    onChange={(e) => setContent(e.target.value)}
                    required
                    value={content}
                    aria-invalid={validContent ? 'false' : 'true'}
                    aria-describedby='contnote'
                    col='30'
                    row='100'
                    onFocus={() => setContentFocus(true)}
                    onBlur={() => setContentFocus(false)}
                />
                <p id='contnote' className={contentFocus && content && !validContent ? 'instructions' : 'offscreen'}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    500 characters minimum.<br />
                </p>
            </label>

            <button type='submit'>Create Story</button>
        </form>
        <span>Written by { auth.user }</span>
        <Footer />
    </section>
  )
}

export default CreateStory