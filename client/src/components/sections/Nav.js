import {useContext} from 'react'
import AuthContext from '../../context/AuthProvider'

const Nav = () => {
    const { auth } = useContext(AuthContext)

  return (
    <nav>
        <h2>Welcome {auth.user} </h2>
        <ul>
            <li>*Edit Profile*</li>
            <li>*User Library*</li>
            <li>*Content Reviews*</li>
        </ul>
    </nav>
  )
}

export default Nav