import {useContext} from 'react'
import AuthContext from '../../context/AuthProvider'
import { HashLink as Link } from 'react-router-hash-link/dist/react-router-hash-link.cjs.production'
import '../../styles/nav.css'

const Nav = () => {
    const { auth } = useContext(AuthContext)

  return (
    <nav>
        <h2 id='title'>Welcome {auth.user} </h2>
        <ul className='nav-links'>
            <li>*Edit Profile*</li>
            <li>*User Library*</li>
            <li><Link to='/create'>Create Story</Link></li>
            <li>*Logout*</li>
        </ul>
    </nav>
  )
}

export default Nav