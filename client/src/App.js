import Register from './Register'
import Login from './Login'
import Home from './components/Home'
import CreateStory from './components/CreateStory'
import Story from './components/Story'
import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet'
import EditStory from './components/EditStory'

function App() {

  return (
    <BrowserRouter>
    <main className="App">
      <Routes>
        <Route element={<Register />} path='/' />
        <Route element={ <Login /> } path='/login' />
        <Route element={ <Home /> } path='/home' />
        <Route element={ <CreateStory /> } path='/create' />
        <Route element={ <Story /> } path = '/story/:storyId' />
        <Route element={ <EditStory /> } path = '/edit/:storyId' />
      </Routes>
      <Helmet>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Neucha&family=Teko&family=Ubuntu+Condensed&family=Zeyada&family=Fjalla+One&display=swap" rel="stylesheet" />
      </Helmet>
    </main>
    </BrowserRouter>
  );

}

export default App;
