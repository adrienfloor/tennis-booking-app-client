import React, { useContext, useState, useEffect } from 'react'
import { NextPage } from 'next'
import { useRouter } from 'next/router'
import { BallTriangle } from 'react-loader-spinner'

import styles from '../styles/Home.module.css'
import { AuthContext } from '../contexts/AuthContext'

const Signup: NextPage = ({ onClose, onNewUserCreated }: any) => {

  const router = useRouter()
  const {
    user,
    signupUser,
    setUser,
    loadUser
  } = useContext(AuthContext)

  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [birthdate, setBirthdate] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    setIsLoading(true)
    loadUser(localStorage.getItem('token'))
    .then((user: any) => {
      if(!user?.isAdmin) {
        router.push('/')
      }
      setIsLoading(false)
    })
  }, [])

  const handleSubmit = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault()
    setIsLoading(true)
    if(
      firstName?.length > 0 &&
      lastName?.length > 0 &&
      email?.length > 0 &&
      phoneNumber?.length > 0 &&
      birthdate?.length > 0
    ) {
      signupUser(
        firstName,
        lastName,
        email,
        birthdate, // initial automatic password
        phoneNumber,
        birthdate
      )
      .then((res: any) => {
        setFirstName('')
        setLastName('')
        setEmail('')
        setBirthdate('')
        setPhoneNumber('')
        onNewUserCreated(res?.data)
        onClose()
        setIsLoading(false)
      })
      .catch((error: any) => {
        console.log('Error : ', error)
        setErrorMessage(error)
        setIsLoading(false)
      })
    } else {
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
      <input
        className={styles.input}
        type='text'
        placeholder='Prénom'
        name='firstName'
        onChange={e => setFirstName(e.target.value)}
        value={firstName}
      />
      <input
        className={styles.input}
        type='text'
        placeholder='Nom'
        name='lastName'
        onChange={e => setLastName(e.target.value)}
        value={lastName}
      />
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
        type='text'
        placeholder='Téléphone'
        name='phoneNumber'
        onChange={e => setPhoneNumber(e.target.value)}
        value={phoneNumber}
      />
      <input
        className={styles.input}
        type='text'
        placeholder='Date de naissance'
        name='birthdate'
        onChange={e => setBirthdate(e.target.value)}
        value={birthdate}
      />
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <button
          onClick={handleSubmit}
          className={styles.submitButton}
        >
          Créer le compte
        </button>
        {
          !errorMessage ?
          <span
            className={styles.linkProfile}
            onClick={onClose}
          >
            annuler
          </span> :
          <div
            className='error-message'
            style={{ maxWidth: '300px', textAlign: 'center' }}
          >
            {errorMessage}
          </div>
        }
      </div>
    </form>
  )
}

export default Signup