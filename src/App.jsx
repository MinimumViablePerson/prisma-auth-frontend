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

          // store the token for later
          localStorage.setItem('token', data.token)

          // put the user in state
          setUser(data.user)
        }
      })
  }

  function signOut () {
    // remove the token from localStorage to "forget" the user
    localStorage.removeItem('token')

    // unset the user in state
    setUser(null)
  }

  useEffect(() => {
    if (localStorage.token) {
      fetch('http://localhost:4000/validate', {
        headers: {
          Authorization: localStorage.token
        }
      })
        .then(resp => resp.json())
        .then(data => {
          if (data.error) {
            // token was not good, we got an error back
            console.log('Invalid token!')
          } else {
            // token is good, we get the user back
            setUser(data)
          }
        })
    }
  }, [])

  if (user === null)
    return (
      <div className='App'>
        <h1>Hello there, stranger!</h1>
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

  return (
    <div className='App'>
      <h1>Hello there, {user.name}!</h1>
      <button onClick={signOut}>SIGN OUT</button>

      <ul>
        {user.photos.map(photo => (
          <li>
            <h2>{photo.title}</h2>
            <img src={photo.imageUrl} alt='' />
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
