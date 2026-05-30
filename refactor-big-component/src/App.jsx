import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import AppRefactor from './v1/App'

function App() {
  const [count, setCount] = useState(0)

  return <AppRefactor />
}

export default App
