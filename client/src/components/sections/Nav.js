import {useContext} from 'react'
import AuthContext from '../../context/AuthProvider'
import { HashLink as Link } from 'react-router-hash-link/dist/react-router-hash-link.cjs.production'
import '../../styles/nav.css'

const Nav = () => {
    const { auth } = useContext(AuthContext)
    const username = auth.user ? auth.user.split(' ')[0] : 'Guest'

  return (
    <nav>
        <h2 id='title'>Welcome {username} </h2>
        <ul className='nav-links'>
            <li><Link to='/home'>Home</Link></li>
            <li>*Edit Profile*</li>
            <li>*User Library*</li>
            <li><Link to='/create'>Create Story</Link></li>
            <li>*Logout*</li>
        </ul>
    </nav>
  )
}

export default Nav