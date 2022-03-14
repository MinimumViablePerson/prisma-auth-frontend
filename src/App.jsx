import { useEffect, useState } from 'react'
import './App.css'

function App () {
  const [user, setUser] = useState(null)

  function signUp (e) {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    fetch('http://localhost:4000/sign-up', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.error) {
          alert('Oops, something went wrong.')
        } else {
          // we managed to create our user!
          localStorage.setItem('token', data.token)
          setUser(data.user)
        }
      })
  }

  function signIn (e) {
    e.preventDefault()
    const email = e.target.email.value
    const password = e.target.password.value

    fetch('http://localhost:4000/sign-in', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email: email, password: password })
    })
      .then(resp => resp.json())
      .then(data => {
        if (data.error) {
          alert(data.error)
        } else {
          // we managed to sign in!
          localStorage.setItem('token', data.token)
          setUser(data.user)
        }
      })
  }

  function signOut () {
    localStorage.removeItem('token')
    setUser(null)
  }

  useEffect(() => {
    if (localStorage.token) {
      fetch('http://localhost:4000/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ token: localStorage.token })
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.error) {
            // token was not good, we got an error back
            alert('Invalid token!')
          } else {
            // token is good, we get the user back
            setUser(data)
          }
        })
    }
  }, [])

  return (
    <div className='App'>
      <h1>Hello there, {user ? user.email : 'stranger'}!</h1>
      {user ? <button onClick={signOut}>SIGN OUT</button> : null}

      <div>
        <form onSubmit={signUp}>
          <h2>Don't have an account? Sign up!</h2>
          <input type='email' required placeholder='email' name='email' />
          <input
            type='password'
            required
            placeholder='password'
            name='password'
          />
          <button>SIGN UP</button>
        </form>

        <form onSubmit={signIn}>
          <h2>Already have an account? Sign in!</h2>
          <input type='email' required placeholder='email' name='email' />
          <input
            type='password'
            required
            placeholder='password'
            name='password'
          />
          <button>SIGN IN</button>
        </form>
      </div>
    </div>
  )
}

export default App
