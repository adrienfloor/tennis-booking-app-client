import React, { useContext, useState, useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { BallTriangle } from 'react-loader-spinner'

import styles from '../styles/Home.module.css'
import { AuthContext } from '../contexts/AuthContext'

const Signin: NextPage = () => {

  const router = useRouter()
  const {
    user,
    signinUser,
    setUser,
    loadUser
  } = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setIsLoading(true)
    loadUser(localStorage.getItem('token'))
    .then((user: any) => {
      if(user?.email) {
        router.push('/')
      }
      setIsLoading(false)
    })
  }, [])

  const handleSubmit = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault()
    setIsLoading(true)
    if(
      email?.length > 0 &&
      password?.length > 0
    ) {
      signinUser(
        email,
        password
      )
      .then((res: any) => {
        setIsLoading(false)
        if(res?.status === 400 && res?.msg) {
          setErrorMessage(res.msg)
          setTimeout(function () {
            setErrorMessage('')
          }, 3000)
          return
        } else {
          localStorage.setItem('token', res?.data?.token)
          setEmail('')
          setPassword('')
          router.push('/')
        }
      })
    } else {
      console.log('signin failed')
      setIsLoading(false)
      setErrorMessage('Ajoutez tous les champs')
      return
    }
  }

  if(isLoading) {
    return (
      <div
        style={{
          width: '100%',
          height: '300px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color='#0070f3'
          ariaLabel='ball-triangle-loading'
          visible={true}
        />
      </div>
    )
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.connectTitle}>Se connecter</label>
      <input
        className={styles.input}
        type='text'
        placeholder='email'
        name='email'
        onChange={e => setEmail(e.target.value)}
        value={email}
      />
      <input
        className={styles.input}
        type='password'
        placeholder='Mot de passe'
        name='password'
        onChange={e => setPassword(e.target.value)}
        value={password}
      />
      <button
        onClick={handleSubmit}
        className={styles.submitButton}
      >
        Se connecter
      </button>
      {
        errorMessage &&
        <div className='error-message' style={{ width: '100%' }}>
          <div style={{ marginTop: '5px', textAlign: 'center'}}>{errorMessage}</div>
        </div>
      }
    </form>
  )
}

export default Signin