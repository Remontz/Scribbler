import { useEffect, useState, useContext } from 'react';
import AuthContext from '../context/AuthProvider';
import Nav from './sections/Nav';
import Footer from './sections/Footer';
import '../styles/home.css';
import axios from '../api/axios';
import { HashLink as Link } from 'react-router-hash-link';
import { faEdit, faSquareXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// TimerBox component
const TimerBox = ({ timeLeft }) => {
  return (
    <div className="timer-box">
      <p>You have 60 seconds to undo the deletion</p>
      <p>Time Left: {timeLeft} seconds</p>
    </div>
  );
};

const Home = () => {
  const { auth } = useContext(AuthContext);
  const [favorites, setFavorites] = useState([]);
  const [stories, setStories] = useState([]);
  const [authorsMap, setAuthorsMap] = useState({});
  const [deletingStory, setDeletingStory] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [deleteTimer, setDeleteTimer] = useState(null);
  const [authorPasswordsMap, setAuthorPasswordsMap] = useState({}); // Store author hashed passwords

  // Combine the two fetch operations into one useEffect
  useEffect(() => {
    axios
      .get('/stories')
      .then((res) => {
        setStories(res.data);

        // Fetch author information (including hashed passwords)
        const authorIds = res.data.map((story) => story.author);
        console.log(authorIds + ' authorIds');
        axios
          .get(`/users/batch?ids=${authorIds.join(',')}`)
          .then((authorRes) => {
            const authorData = authorRes.data;

            // Store author names and hashed passwords
            const authorNamesMap = {};
            const hashedPasswordsMap = {};

            authorData.forEach((author) => {
              authorNamesMap[author._id] = author.username;
              hashedPasswordsMap[author._id] = author.password; // Store hashed passwords securely
            });

            setAuthorsMap(authorNamesMap);
            setAuthorPasswordsMap(hashedPasswordsMap); // Store hashed passwords in state
          })
          .catch((err) => console.log('Error fetching authors', err));
      })
      .catch((err) => console.log('Error fetching stories', err));
  }, []);

  // Delete Story Logic
  const handleDeleteStory = (story) => {
    console.log('Deleting Story', story + 'ID: ' + story._id);
    setDeletingStory(story);
    setDeleteConfirmation('');
  };

  const handleDeleteConfirmationChange = (e) => {
    setDeleteConfirmation(e.target.value);
  };

  const handleDeleteCancel = () => {
    setDeletingStory(null);
    setDeleteConfirmation('');
  };

  // Delete Story Confirmed
  const handleDeleteConfirm = () => {
    if (deleteConfirmation === authorPasswordsMap[deletingStory.author]) {
      // Password confirmation is correct - Delete Story
      axios
        .delete(`/stories/${deletingStory._id}`)
        .then(() => {
          // update the list of stories
          const updatedStories = stories.filter((story) => story._id !== deletingStory._id);
          setStories(updatedStories);
          setDeletingStory(null);

          // Display a message about the deletion
          console.log(`Story ${deletingStory.title} has been deleted`);
        })
        .catch((err) => {
          console.log(`Error deleting story ${deletingStory.title}`, err);
        });
    } else {
      // Password Confirmation is incorrect
      console.log('Incorrect Password');
    }
  };

  const handleDeleteTimer = () => {
    if (deleteTimer) {
      clearTimeout(deleteTimer);
    }
    const timer = setTimeout(() => {
      setDeleteConfirmation('');
    }, 60000);
    setDeleteTimer(timer);
  };

  return (
    <section id='home'>
      <Nav />
      <article id='faves' className='dark-green'>
        <h2>Favorites</h2>
        <ul>
          {favorites.map((story, index) => {
            return <li key={index}>{story}</li>;
          })}
        </ul>
      </article>
      <div className='gradient'></div>
      <article id='library' className='green'>
        <h2>Global Library</h2>
        <ul>
          {stories.map((story, index) => {
            const authorName = authorsMap[story.author] || 'Anonymous';

            return (
              <li key={index}>
                <span>
                  <Link to={`/story/${story._id}`}>{story.title}</Link>
                </span>
                <span>&emsp; by {authorName}</span> <br />

                <div id='story-links'>
                  <span id='edit-story'>
                    <Link to={`/edit/${story._id}`}>
                      <FontAwesomeIcon icon={faEdit} />
                    </Link>
                  </span>
                  <span id='delete-story' onClick={() => handleDeleteStory(story)}>
                    <FontAwesomeIcon icon={faSquareXmark} />
                  </span>
                </div>

                <div id='divider'></div>
              </li>
            );
          })}
        </ul>
      </article>
      {deleteTimer && <TimerBox timeLeft={deleteTimer / 1000} />}
      <Footer />
    </section>
  );
};

export default Home;
