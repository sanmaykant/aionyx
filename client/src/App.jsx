import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { login } from './api/OAuthApi'

async function HandleAuth() {
  const resBody=await login()
  const url=resBody.url;
  window.location.href=url
}

function App() {
  return (
    <>
      <button onClick={HandleAuth}>Log in</button>
    </>
  )
}


export default App
