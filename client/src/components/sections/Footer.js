import {useState, useContext} from 'react'
import AuthContext from '../../context/AuthProvider'
import '../../styles/footer.css'

const Footer = () => {
  const { auth } = useContext(AuthContext)

  const [extLinks] = useState({
    github: 'https://github.com/Remontz',
    linkedin: 'https://www.linkedin.com/in/kacy-gilbert-1b1b1b1b1/',
    portfolio: 'https://kacy-gilbert-portfolio.netlify.app/',
    email: 'gilbertkacy90@gmail.com'
  })

  const handleEmail = (e) => {
    e.preventDefault()
    window.location.href = `mailto:${extLinks.email}`
  }

  return (
    <footer>
      <h2>Kacy Gilbert - Software Developer</h2>
      <ul className='footer-list'>
        <li>
          <a href={extLinks.github} target='_blank' rel='noreferrer'>
            GitHub
          </a>
        </li>
        <li>
          <a href={extLinks.linkedin} target='_blank' rel='noreferrer'>
            LinkedIn
          </a>
        </li>
        <li>
          <a href={extLinks.portfolio} target='_blank' rel='noreferrer'>
            Portfolio
          </a>
        </li>
        <li>
          <a href='/' onClick={handleEmail}>
            Email
          </a>
        </li>
      </ul>
      <p><small>&copy;2023 Kacy Gilbert. All Rights Reserved.</small></p>
    </footer>
  )
}

export default Footer