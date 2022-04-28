import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import Home from './Pages/Home'

function App() {
  return (
    <Router>
        <Nav/>

        <Routes>
            <Route exact path='/' element={<Home/>}/>
        </Routes>

        <Footer/>
    </Router>
  );
}

export default App;
