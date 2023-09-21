import { useEffect, useState, useContext } from 'react'
import AuthContext from '../context/AuthProvider'
import Nav from './sections/Nav'
import Footer from './sections/Footer'
import '../styles/home.css'
import axios from 'axios'


const Home = () => {
  const { auth } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([])
  const [library, setLibrary] = useState([])
  const [ownedWork, setOwnedWork] = useState([])
  const [stories, setStories] = useState([])


  useEffect(() => {
    axios.get(`http://localhost:3500/api/stories`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
    .then((response) => {
      console.log(response.data)
      setStories(response.data)
    })
    .catch((error) => {
      console.log(error)
    })
  }, [auth])

  useEffect(() => {
    axios.get(`http://localhost:3500/api/users/${auth._id}`, {
      headers: {
        Authorization: `Bearer ${auth.accessToken}`,
      },
    })
    .then((response) => {
      console.log(response.data)
      setFavorites(response.data.favorites)
      setLibrary(response.data.library)
      setOwnedWork(response.data.ownedWork)
    })
    .catch((error) => {
      console.log(error)
      })
      console.log(auth)
  }, [auth])

  return (
    <section id='home'>
        <Nav />
        <article id='faves' className='dark-green'>
          <h2>Favorites</h2>
          <ul>
          { favorites.map((story, index) => {
            return(
              <li>{story}</li>
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
              <li>
                <span>{story.title}</span>
                <span>{story.author}</span>
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