import { BrowserRouter as Router, Route, Routes, BrowserRouter } from 'react-router-dom'
import Home from './component/pages/Home/Home'
import Room from './component/pages/Room/Room'
import Header from './component/UI/Header/Header'
import Login from './component/pages/Login/Login'

function App() {

  return (
    <div className='App'>
      <Router basename={import.meta.env.DEV ? '/' : '/fantqw2gv2'}>
        <Header/>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="/room/:roomId" element={<Room/>} />
          <Route path='/login' element={<Login/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
