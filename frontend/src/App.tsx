import { BrowserRouter , Route , Routes } from 'react-router-dom'
import './App.css'
import { Receiver } from './components/receiver'
import { Sender } from './components/sender'

function App() {
  return (
    <div>
      <BrowserRouter>
       <Routes>
        <Route path='/sender' element={<Sender></Sender>} ></Route>
        <Route path='/receiver' element={<Receiver></Receiver>}></Route>
       </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
