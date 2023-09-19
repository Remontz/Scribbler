import Register from './Register'
import Login from './Login'
import Home from './components/Home';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {

  return (
    <BrowserRouter>
    <main className="App">
      <Routes>
        <Route element={<Register />} path='/' />
        <Route element={ <Login /> } path='/login' />
        <Route element={ <Home /> } path='/home' />
      </Routes>
    </main>
    </BrowserRouter>
  );

}

export default App;
