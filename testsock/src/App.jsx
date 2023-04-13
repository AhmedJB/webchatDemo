import { useState , useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Show from './components/Show'

function App() {
  const [count, setCount] = useState(0)

  
  



  return (
    <div className="App container mx-auto  w-full min-h-screen grid place-items-center ">
      <Show />
    </div>
  )
}

export default App
