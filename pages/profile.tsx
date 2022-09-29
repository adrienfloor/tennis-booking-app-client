import * as React from 'react'
import { useContext, useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import { BsFillPersonFill } from 'react-icons/bs'
import { BallTriangle } from 'react-loader-spinner'

import styles from '../styles/Home.module.css'
import { AuthContext } from '../contexts/AuthContext'
import { UsersContext } from '../contexts/UsersContext'
import { ToastContext } from '../contexts/ToastContext'
import {
  isValidEmailInput,
  nbrOfDaysToThisDate,
  isValidPhoneNumber
} from '../utils'

const Profile = () => {

  const { user, loadUser } = useContext(AuthContext)
  const { updateUser, updateUserCredentials } = useContext(UsersContext)
  const { addToast } = useContext(ToastContext)

  useEffect(() => {
    loadUser(localStorage.getItem('token'))
    .then((user: any) => {
      setNewEmail(user.email)
      setNewPhoneNumber(user.phoneNumber)
    })
  }, [])

  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [isEditingPassword, setIsEditingPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [newEmail, setNewEmail] = useState(user ? user.email : '')
  const [newPhoneNumber,setNewPhoneNumber] = useState(user ? user.phoneNumber: '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmitNewPassword = () => {
    setIsLoading(true)

    if(!currentPassword) {
      setErrorMessage('Ajouter votre mot de passe actuel')
      setTimeout(function () {
        setErrorMessage('')
      }, 3000)
      setIsLoading(false)
      return
    }

    if(currentPassword && (newPassword.length < 8 || newPasswordConfirmation.length < 8)) {
      setErrorMessage('Le nouveau mot de passe doit contenir au moins 8 caractères')
      setTimeout(function () {
        setErrorMessage('')
      }, 3000)
      setIsLoading(false)
      return
    }

    if(
      currentPassword && (newPassword !== newPasswordConfirmation)) {
      setErrorMessage('Les nouveau mot de passe et sa confirmation ne sont pas identiques')
      setTimeout(function () {
        setErrorMessage('')
      }, 3000)
      setIsLoading(false)
      return
    }

    updateUserCredentials(
      user._id,
      currentPassword,
      newPassword,
      localStorage.getItem('token'))
    .then((res: any) => {
      setIsLoading(false)
      if(res?.status === 400 && res?.msg) {
        setErrorMessage(res.msg)
        setTimeout(function () {
          setErrorMessage('')
        }, 5000)
        return
      } else {
        loadUser(localStorage.getItem('token'))
        .then((user: any) => {
          addToast('Mot de passe enregistré')
          setCurrentPassword('')
          setNewPassword('')
          setNewPasswordConfirmation('')
          setIsEditingPassword(false)
        })
      }
    })
  }

  const handleSubmitNewProfile = () => {
    setIsLoading(true)

    if(!isValidEmailInput(newEmail)) {
      setErrorMessage('Format email incorrect')
      setIsLoading(false)
      setTimeout(function () {
        setErrorMessage('')
      }, 3000)
      return
    }

    if(!isValidPhoneNumber(newPhoneNumber)) {
      setErrorMessage('Format téléphone incorrect')
      setIsLoading(false)
      setTimeout(function () {
        setErrorMessage('')
      }, 3000)
      return
    }

    updateUser({
      _id: user._id,
      email: newEmail,
      phoneNumber: newPhoneNumber
    }, localStorage.getItem('token'))
    .then((res: any) => {
      loadUser(localStorage.getItem('token'))
      .then((user: any) => {
        addToast('Modifications enregistrées')
        setNewEmail(user.email)
        setNewPhoneNumber(user.phoneNumber)
        setIsLoading(false)
        setIsEditingProfile(false)
      })
    })
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

  const returnContent = () => {
    return (
      <CardContent>
        {
          (isEditingProfile || isEditingPassword) ?
          <div className={styles.profileForm}>
            {
              isEditingProfile &&
              <>
                <label className={styles.profileFormLabel}>Email</label>
                <input
                  className={styles.profileInput}
                  type='text'
                  placeholder='Nouvel email'
                  name='email'
                  onChange={e => setNewEmail(e.target.value)}
                  value={newEmail}
                />
                <label className={styles.profileFormLabel}>Téléphone</label>
                <input
                  className={styles.profileInput}
                  type='text'
                  placeholder='Nouveau téléphone'
                  name='phoneNumber'
                  onChange={e => setNewPhoneNumber(e.target.value)}
                  value={newPhoneNumber}
                />
              </>
            }
            {
              isEditingPassword &&
              <>
                <label className={styles.profileFormLabelPassword}>{`Mot de passe (au moins 8 caractères)`}</label>
                <input
                  className={styles.profileInput}
                  type='password'
                  placeholder='Mot de passe actuel'
                  name='currentPassword'
                  onChange={e => setCurrentPassword(e.target.value)}
                  value={currentPassword}
                />
                <input
                  className={styles.profileInput}
                  type='password'
                  placeholder='Nouveau mot de passe'
                  name='newPassword'
                  onChange={e => setNewPassword(e.target.value)}
                  value={newPassword}
                />
                <input
                  className={styles.profileInput}
                  type='password'
                  placeholder='Confirmer le mot de passe'
                  name='newPasswordConfirmation'
                  onChange={e => setNewPasswordConfirmation(e.target.value)}
                  value={newPasswordConfirmation}
                />
              </>
            }
            <button
              style={{ marginTop: '40px'}}
              onClick={
                isEditingPassword ?
                () => handleSubmitNewPassword() :
                () => handleSubmitNewProfile()
              }
              className={styles.submitButton}
            >
              Enregistrer
            </button>
            {
              !errorMessage ?
              <span
                className={styles.linkProfile}
                onClick={() => {
                  setIsEditingProfile(false)
                  setIsEditingPassword(false)
                }}
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
          </div> :
          <>
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center'
                }}
              >
              {/* <Avatar alt="Remy Sharp" sx={{ width: 50, height: 50, marginRight: '10px' }}>
                <BsFillPersonFill size='40px' />
              </Avatar> */}
              <Typography variant="h4" component="div" color="common.black">
                {`${user?.firstName} ${user?.lastName}`}
              </Typography>
            </div>
            <div style={{ display: 'flex' }}>
              <Typography sx={{ mt: 2.5 }} color="common.black">
                Abonnement expire dans :
              </Typography>
              <Typography sx={{ ml: 1, mt: 2.5 }} color="common.black">
                {`${nbrOfDaysToThisDate(new Date(user?.expiration))} jours`}
              </Typography>
            </div>
            <div style={{ display: 'flex' }}>
              <Typography sx={{ mt: 1.5 }} color="common.black">
                Invitations disponibles :
              </Typography>
              <Typography sx={{ ml: 1, mt: 1.5 }} color="common.black">
                {`${user?.invites} invitations`}
              </Typography>
            </div>
            <div style={{ display: 'flex' }}>
              <Typography sx={{ mt: 1.5 }} color="common.black">
                Email :
              </Typography>
              <Typography sx={{ ml: 1, mt: 1.5 }} color="common.black">
                {user?.email}
              </Typography>
            </div>
            <div style={{ display: 'flex' }}>
              <Typography sx={{ mt: 1.5 }} color="common.black">
                Téléphone :
              </Typography>
              <Typography sx={{ ml: 1, mt: 1.5 }} color="common.black">
                {user?.phoneNumber}
              </Typography>
            </div>
            <div style={{ display: 'flex' }}>
              <Typography sx={{ mt: 1.5 }} color="common.black">
                Mot de passe :
              </Typography>
              <Typography sx={{ ml: 1, mt: 1.5 }} color="common.black">
                **********
              </Typography>
            </div>
            <div
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              onClick={() => setIsEditingProfile(true)}
            >
              <span
                className={styles.linkProfile}
                style={{ marginTop: '30px' }}
              >
                éditer mes coordonées
              </span>
            </div>
            <div
              style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
              onClick={() => setIsEditingPassword(true)}
            >
              <span
                className={styles.linkProfile}
                style={{ marginTop: '10px' }}
              >
                éditer mon mot de passe
              </span>
            </div>
          </>
        }
      </CardContent>
    )
  }

  return (
    <>
      <div className='desktop-only tablet-only'>
        <Card sx={{ minWidth: 600, minHeight: 600 }}>
          {returnContent()}
        </Card>
      </div>
      <div className='mobile-only'>
        <Card sx={{ minWidth: '350px', minHeight: 600 }}>
          {returnContent()}
        </Card>
      </div>
    </>
  )
}

export default Profile