import * as React from 'react'
import { useContext, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import moment from 'moment'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'

import styles from '../styles/Home.module.css'
import { AuthContext } from '../contexts/AuthContext'
import { BookingContext } from '../contexts/BookingContext'
import { courtNamesReferences } from '../fixtures'

export default function BookingDialog({
  isOpen,
  onClose,
  users,
  bookingInfo,
  onBookingCreated,
  isUpdatingBooking,
  onBookingDeleted
}:any) {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'))
  const { user } = useContext(AuthContext)
  const { createBooking, deleteBooking } = useContext(BookingContext)
  const {
    court,
    time,
    date
  } = bookingInfo
  const [player2, setPlayer2] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent<EventTarget>) => {
    e.preventDefault()

    if(isUpdatingBooking) {
      setIsDeleteDialogOpen(true)
      return
    }
    
    setIsLoading(true)

    const player1 = user
    const isAdminBooking = user.isAdmin

    createBooking(
      date,
      time,
      court + 1, // index of array equals to Court Number minus 1
      player1,
      player2,
      isAdminBooking,
      localStorage.getItem('token')
    )
    .then((res: any) => {
      setIsLoading(false)
      if(res?.status === 400 && res?.msg) {
        setErrorMessage(res.msg)
        setTimeout(function () {
          setErrorMessage('')
        }, 5000)
        return
      } else {
        onBookingCreated(date)
      }
    })
    .catch((err: any) => {
      console.log('create booking err : ', err)
      // setErrorMessage(err)
      setIsLoading(false)
    })
  }

  const onPlayer2Select = (value: any) => {
    if(!value) {
      setPlayer2(null)
      return
    }
    const firstName = value.split(' ')[0]
    const lastName = value.split(' ')[1]

    const player = users.find((user: any) => (
      user.firstName === firstName && user.lastName === lastName
    ))
    setPlayer2(player)
  }

  const handleDeleteBooking = () => {
    setIsLoading(true)
    deleteBooking(
      date,
      bookingInfo._id,
      user._id,
      localStorage.getItem('token')
    ).then((res: any) => {
      setIsLoading(false)
      if(res?.status === 400 && res?.msg) {
        setErrorMessage(res.msg)
        setTimeout(function () {
          setErrorMessage('')
        }, 5000)
        return
      } else {
        setIsDeleteDialogOpen(false)
        onBookingDeleted(date)
      }
    })
    .catch((err: any) => { console.log(err)})
  }

  if(isLoading) {
    return (
      <div>...loading...</div>
    )
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isOpen}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <div className='dialog-content'>
        <div
          onClick={onClose}
          className='dialog-close-button'
        >
          X
        </div>
        <form className={styles.form} onSubmit={handleSubmit}>
          { isUpdatingBooking ?
            <>
              {
                bookingInfo?.isAdminBooking &&
                <label style={{ margin: '10px 0' }}>Type de réservation : Admin</label>
              }
              <label style={{ margin: '10px 0' }}>{`Joueur 1 : ${bookingInfo?.player1?.firstName} ${bookingInfo?.player1?.lastName}`}</label>
              {
                bookingInfo?.player2?._id &&
                <label style={{ margin: '10px 0' }}>{`Joueur 2 : ${bookingInfo?.player2?.firstName} ${bookingInfo?.player2?.lastName}`}</label>
              }
            </> :
            <label style={{ margin: '10px 0' }}>{`Adhérent : ${user.firstName} ${user.lastName}`}</label>
          }
          <label style={{ margin: '10px 0' }}>{`Heure : ${time}`}</label>
          <label style={{ margin: '10px 0' }}>{`Date : ${moment(date).format("D MM YYYY")}`}</label>
          <label style={{ margin: '10px 0' }}>{`Court : ${courtNamesReferences[court+1]}`}</label>
          { !isUpdatingBooking &&
            <Autocomplete
              disablePortal
              options={users.map((user: any) => `${user?.firstName} ${user?.lastName}`)}
              sx={{ width: 300, margin: '10px 0 50px 0' }}
              renderInput={(params) => <TextField {...params} label='Partenaire' />}
              onChange={(event, value) => onPlayer2Select(value)}
              noOptionsText='Aucun joueur'
            />
          }
          <button
            onClick={handleSubmit}
            className={isUpdatingBooking ? styles.deleteButton : styles.submitButton}
          > 
            { isUpdatingBooking ? 'Supprimer cette réservation' : 'Réserver ce court'}
          </button>
          {
            errorMessage &&
            <div className='error-message' style={{ marginTop: '20px 0' }}>
              <div>Action impossible : </div>
              <div style={{ marginTop: '5px'}}>{errorMessage}</div>
            </div>
          }
        </form>
      </div>
      { isDeleteDialogOpen &&
        <Dialog
          keepMounted
          open={true}
          onClose={() => setIsDeleteDialogOpen(false)}
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Êtes-vous sûr de vouloir supprimer cette réservation ?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setIsDeleteDialogOpen(false)}>Annuler</Button>
            <Button onClick={handleDeleteBooking}>Confirmer</Button>
          </DialogActions>
        </Dialog>
      }
    </Dialog>
  )
}