import { useEffect, useState, useContext } from 'react'
import AuthContext from '../context/AuthProvider'
import Nav from './sections/Nav'
import Footer from './sections/Footer'
import '../styles/home.css'
import axios from '../api/axios'
import { HashLink as Link } from 'react-router-hash-link';


const Home = () => {
  const { auth } = useContext(AuthContext);
  const [author, setAuthor] = useState('')
  const [favorites, setFavorites] = useState([])
  const [library, setLibrary] = useState([])
  const [ownedWork, setOwnedWork] = useState([])
  const [stories, setStories] = useState([])
  const [authorsMap, setAuthorsMap] = useState({}) // Store author names


  // Fetch All Stories on page load
  useEffect(() => {
    axios.get('/stories')
    .then(res => {
      setStories(res.data)
      // Fetch and store author Names
      const authorIds = res.data.map(story => story.author)
      console.log(authorIds + ' authorIds')
      fetchAuthorsNames(authorIds)
    })
    .catch(err => console.log('Error fetching stories', err))
  }, [])

  // Fetch Author Names
  const fetchAuthorsNames = (authorIds) => {
    authorIds.forEach(authorId => {
      axios.get(`/users/${authorId}`)
      .then(res => {
        console.log('Author Name Response:', res.data.username) // debugging Author Name
        setAuthorsMap(prevAuthors => ({
          ...prevAuthors,
          [authorId]: res.data.username, // Store author name by ID
        }))
      })
      .catch(err => console.log(err))
    })
  }


  return (
    <section id='home'>
        <Nav />
        <article id='faves' className='dark-green'>
          <h2>Favorites</h2>
          <ul>
          { favorites.map((story, index) => {
            return(
              <li key={index}>{story}</li>
            )
          }) }
          </ul>
        </article>
        <div className='gradient'></div>
        <article id='library' className='green'>
          <h2>Global Library</h2>
          <ul>
          { stories.map((story, index) => {
            return(
              <li key={index}>
                <span> <Link to={`/story/${story._id}`}> {story.title} </Link> </span>
                <span> by {authorsMap[story.author]}</span>
              </li>
            )
          }) }
          </ul>
        </article>
        <Footer />
    </section>
  )
}

export default Home