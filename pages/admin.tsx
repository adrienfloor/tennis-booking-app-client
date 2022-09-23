import * as React from 'react'
import { useContext, useState, useEffect } from 'react'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import {
  BsFillLockFill,
  BsFillPlusCircleFill
} from 'react-icons/bs'
import TextField from '@mui/material/TextField'
import Autocomplete from '@mui/material/Autocomplete'
import { styled } from '@mui/material/styles'
import { Box, FormControl, InputLabel } from '@mui/material'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { addDays } from 'date-fns'
import OutlinedInput from '@mui/material/OutlinedInput'
import MenuItem from '@mui/material/MenuItem'
import ListItemText from '@mui/material/ListItemText'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import Checkbox from '@mui/material/Checkbox'
import { fr } from 'date-fns/locale'
import moment from 'moment'
import { useRouter } from 'next/router'
import { BallTriangle } from 'react-loader-spinner'

import styles from '../styles/Home.module.css'
import { AuthContext } from '../contexts/AuthContext'
import { UsersContext } from '../contexts/UsersContext'
import { BookingContext } from '../contexts/BookingContext'
import { ToastContext } from '../contexts/ToastContext'
import Signup from '../components/signup'
import {
  nbrOfDaysToThisDate,
  returnDateInOneYear,
  dateInOneMonth,
  getDatesInRange
} from '../utils'
import {
  bookingHours,
  courtsNames,
  courtNamesToNumber
} from '../fixtures'

const StyledAutocomplete = styled(Autocomplete)({
  // ".MuiAutocomplete-inputRoot": {
  //   color: "white",
  //   backgroundColor: "#2D2C2C",
  //   "& .MuiInputAdornment-root": {
  //     color: "white"
  //   },
  //   "& .MuiOutlinedInput-notchedOutline": {
  //     borderWidth: "2px",
  //     borderColor: "white"
  //   },
  //   "& .MuiAutocomplete-endAdornment .MuiSvgIcon-root": {
  //     color: "white !important"
  //   },
  //   "&:hover .MuiOutlinedInput-notchedOutline": {
  //     borderWidth: "2px",
  //     borderColor: "white"
  //   },
  //   "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //     borderWidth: "2px",
  //     borderColor: "white"
  //   }
  // }
});

const StyledTextField = styled(TextField)({
  // "& label, & label.Mui-focused": {
  //   color: 'white'
  // },
  // "& MuiTextField-root .Mui-focused": {
  //   outline: 'none'
  // },
  // "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
  //   borderWidth: 0,
  //   outline: 'none'
  // }
})

const StyledOptionBox = styled(Box)({
  height: '100%',
  padding: '5px',
  cursor: 'pointer'
  // // backgroundColor: '#2D2C2C',
  // // color: 'white'
})

const StyledButtonGroup = styled(ButtonGroup)({
  // change the button group dividers color
  // '& .MuiButtonGroup-grouped': {
  //   borderColor: "white"
  // }
})

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const Admin = () => {

  const { user } = useContext(AuthContext)
  const {
    updateUser,
    users,
    fetchUsers,
    fetchUser
  } = useContext(UsersContext)
  const {
    createBatchBooking,
    deleteBatchBooking
  } = useContext(BookingContext)
  const { addToast } = useContext(ToastContext)
  const router = useRouter()

  useEffect(() => {
    fetchUsers(localStorage.getItem('token'))
    .then((users: any) => {
      setIsLoading(false)
    })
  }, [])

  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [userFocus, setUserFocus] = useState(null)
  const [isAddingUser, setIsAddingUser] = useState(false)
  const [isBatchBooking, setIsBatchBooking] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [datesRange, setDatesRange] = useState([
    {
      startDate: addDays(new Date(), 2),
      endDate: addDays(new Date(), 9),
      key: 'selection'
    }
  ]) 
  const [maxDate, setMaxDate] = useState(dateInOneMonth(new Date()))
  const [hoursSlots, setHoursSlot] = useState([])
  const [courtsSelected, setCourtsSelected] = useState([])


  const handleRenewMembership = () => {
    setIsLoading(true)

    updateUser({
      _id: userFocus._id,
      expiration: returnDateInOneYear(),
      invites: 3
    }, localStorage.getItem('token'))
    .then((res: any) => {
      fetchUser(userFocus._id, localStorage.getItem('token'))
      .then((user: any) => {
        addToast('Renouvelé avec succès')
        setUserFocus(user)
        setIsLoading(false)
        setIsDialogOpen(false)
      })
    })
  }

  const handleUserInvitationsChange = (inc: bool) => {

    if(
      (userFocus.invites === 3 && inc) ||
      (userFocus.invites === 0 && !inc)
    ) {
      return
    }
    const updatedUserFocus = userFocus
    updatedUserFocus.invites = inc ? userFocus.invites + 1 : userFocus.invites - 1
    updateUser({
      _id: userFocus._id,
      invites: updatedUserFocus.invites
    }, localStorage.getItem('token'))
    .then((res: any) => {
      fetchUser(userFocus._id, localStorage.getItem('token'))
      .then((user: any) => {
        setUserFocus(user)
      })
    })
    setUserFocus(updatedUserFocus)
  }

  const handleBookingHours = (event: any) => {
    const {
      target: { value },
    } = event
    setHoursSlot(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    )
  }

  const handleCourtsSelected = (event: any) => {
    const {
      target: { value },
    } = event
    setCourtsSelected(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    )
  }

  const handleSubmitBatchBook = (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const courts = courtsSelected.map(court => courtNamesToNumber[court])
    const hours = hoursSlots
    const dates = getDatesInRange(datesRange[0].startDate, datesRange[0].endDate)

    createBatchBooking(courts, hours, dates, user.isAdmin, localStorage.getItem('token', ), user)
    .then((res: any) => {
      if(res?.status === 400 && res?.msg) {
        setIsLoading(false)
        setErrorMessage(res.msg)
        setTimeout(function () {
          setErrorMessage('')
        }, 5000)
        return
      } else {
        addToast('Réservation enregistrée')
        // setIsBatchBooking(false)
        setIsLoading(false)
        // router.push(`/?date=${datesRange[0].startDate}`)
      }
    })
  }

  const handleDeleteBatchBook = (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const courts = courtsSelected.map(court => courtNamesToNumber[court])
    const hours = hoursSlots
    const dates = getDatesInRange(datesRange[0].startDate, datesRange[0].endDate)

    deleteBatchBooking(courts, hours, dates, user.isAdmin, user, localStorage.getItem('token'))
    .then((res: any) => {
      if(res?.status === 400 && res?.msg) {
        setIsLoading(false)
        setErrorMessage(res.msg)
        setTimeout(function () {
          setErrorMessage('')
        }, 5000)
        return
      } else {
        addToast('Réservation supprimée')
        setIsLoading(false)
      }
    })
  }
  
  const returnContent = () => {
    if(isAddingUser) {
      return (
      <Signup
        onClose={() => setIsAddingUser(false)}
        onNewUserCreated={(user: any) => {
          fetchUsers(localStorage.getItem('token'))
          setUserFocus(user)
          addToast("L'utilisateur a été créé")
        }}
      />
    )} else if(userFocus) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', width: '320px', justifyContent: 'flex-start' }}>
            <Typography sx={{ mt: 2.5 }} color="common.black">
              Abonné :
            </Typography>
            <Typography sx={{ ml: 1, mt: 2.5 }} color="common.black">
              {`${userFocus?.firstName} ${userFocus?.lastName}`}
            </Typography>
          </div>
          <div style={{ display: 'flex', width: '320px', justifyContent: 'flex-start' }}>
            <Typography sx={{ mt: 1.5 }} color="common.black">
              Abonnement expire dans :
            </Typography>
            <Typography sx={{ ml: 1, mt: 1.5 }} color="common.black">
              {`${nbrOfDaysToThisDate(new Date(userFocus?.expiration))} jours`}
            </Typography>
          </div>
          <div style={{ display: 'flex', width: '320px', justifyContent: 'flex-start' }}>
            <Typography sx={{ mt: 1.5 }} color="common.black">
              Invitations disponibles :
            </Typography>
            <Typography sx={{ ml: 1, mt: 1.5, mr: 2 }} color="common.black">
              {`${userFocus?.invites}`}
            </Typography>
            <StyledButtonGroup sx={{ mt: 1 }} >
              <Button
                aria-label='reduce'
                onClick={() => handleUserInvitationsChange(false)}
              >
                <RemoveIcon fontSize='small' sx={{ color: 'black' }} />
              </Button>
              <Button
                aria-label='increase'
                onClick={() => handleUserInvitationsChange(true)}
              >
                <AddIcon fontSize='small' sx={{ color: 'black' }} />
              </Button>
            </StyledButtonGroup>
          </div>
          <div
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              marginTop: '20px'
            }}
          >
            <button
              onClick={() => setIsDialogOpen(true)}
              className={styles.submitButton}
            >
              Renouveler l'abonnement
            </button>
            {
              !errorMessage ?
              <span
                className={styles.linkProfile}
                onClick={() => setUserFocus(null)}
              >
                retour
              </span> :
              <div
                className='error-message'
                style={{ maxWidth: '300px', textAlign: 'center' }}
              >
                {errorMessage}
              </div>
            }
          </div>
          { isDialogOpen &&
            <Dialog
              keepMounted
              open={true}
              onClose={() => setIsDialogOpen(false)}
            >
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  Êtes-vous sûr de vouloir renouveler cet abonnement ?
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleRenewMembership}>Confirmer</Button>
              </DialogActions>
            </Dialog>
          }
        </div>
      )
    } else if(isBatchBooking) {
      return (
        <>
          <form
            className={styles.form}
            onSubmit={handleSubmitBatchBook}
            style={{
              maxWidth: '800px',
              maxHeight: '600px',
              overflow: 'auto'
            }}
          >
            <div className='desktop-only'>
              <DateRangePicker
                direction='horizontal'
                color='#0070F3'
                dateDisplayFormat='d MMM YYY'
                locale={fr}
                ranges={datesRange}
                onChange={item => {
                  setMaxDate(addDays(item.selection.startDate, 30))
                  setDatesRange([item.selection])
                }}
                preventSnapRefocus={true}
                months={2}
                minDate={new Date()}
                maxDate={maxDate}
                // moveRangeOnFirstSelection={false}
                // retainEndDateOnFirstSelection={true}
              />
            </div>
            <div className='mobile-only'>
              <DateRangePicker
                direction='vertical'
                color='#0070F3'
                dateDisplayFormat='d MMM YYY'
                locale={fr}
                ranges={datesRange}
                onChange={item => {
                  setMaxDate(addDays(item.selection.startDate, 30))
                  setDatesRange([item.selection])
                }}
                preventSnapRefocus={true}
                months={1}
                minDate={new Date()}
                maxDate={maxDate}
                // moveRangeOnFirstSelection={false}
                // retainEndDateOnFirstSelection={true}
              />
            </div>
            {
              errorMessage &&
              <div className='error-message' style={{ margin: '10px 0' }}>
                <div>{errorMessage}</div>
              </div>
            }
            <label className={styles.bookingInputLabel}>Créneaux horaires</label>
            <Select
              multiple
              value={hoursSlots}
              onChange={handleBookingHours}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
              sx={{ width: '300px', mt: '20px', color: 'black' }}
              label='Heures'
            >
              {bookingHours.map((slot: any) => (
                <MenuItem key={slot} value={slot}>
                  <Checkbox checked={hoursSlots.indexOf(slot) > -1} />
                  <ListItemText primary={slot} />
                </MenuItem>
              ))}
            </Select>
            <label
              className={styles.bookingInputLabel}
              style={{ marginTop: '20px' }}
            >
              Courts
            </label>
            <Select
              multiple
              value={courtsSelected}
              onChange={handleCourtsSelected}
              input={<OutlinedInput label="Tag" />}
              renderValue={(selected) => selected.join(', ')}
              MenuProps={MenuProps}
              sx={{ width: '300px', mt: '20px', color: 'black' }}
            >
              {courtsNames.slice(1, courtsNames.length).map((name: any) => (
                <MenuItem key={name} value={name}>
                  <Checkbox checked={courtsSelected.indexOf(name) > -1} />
                  <ListItemText primary={name} />
                </MenuItem>
              ))}
            </Select>
            <div style={{ display: 'flex', width: '300px' }}>
              <Typography sx={{ mt: 2.5 }} color="common.black">
                Dates :
              </Typography>
              <Typography sx={{ ml: 1, mt: 2.5 }} color="common.black">
              {`Du ${moment(datesRange[0].startDate).format("D MM YYYY")} au ${moment(datesRange[0].endDate).format("D MM YYYY")}`}
              </Typography>
            </div>
            {
              courtsSelected?.length > 0 &&
              <div style={{ display: 'flex', maxWidth: '300px' }}>
                <Typography sx={{ mt: 2.5, minWidth: '60px' }} color="common.black">
                  Courts :
                </Typography>
                <Typography sx={{ ml: 1, mt: 2.5 }} color="common.black">
                  {courtsSelected.join(', ')}
                </Typography>
              </div>
            }
            {
              hoursSlots?.length > 0 &&
              <div style={{ display: 'flex', maxWidth: '300px'}}>
                <Typography sx={{ mt: 2.5, minWidth: '60px' }} color="common.black">
                  Heures :
                </Typography>
                <Typography sx={{ ml: 1, mt: 2.5 }} color="common.black">
                  {hoursSlots.join(', ')}
                </Typography>
              </div>
            }
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '10px'
              }}
            >
              <button
                onClick={handleSubmitBatchBook}
                className={styles.submitButton}
              >
                Enregistrer
              </button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <button
                onClick={handleDeleteBatchBook}
                className={styles.submitButtonLight}
              >
                Supprimer
              </button>
            </div>
            <div
              style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                marginTop: '20px'
              }}
            >
              <span
                className={styles.linkProfile}
                onClick={() => setIsBatchBooking(false)}
              >
                retour
              </span>
            </div>
          </form>
        </>
      )
    } else {
      //default
      return (
        <>
          <div style={{ display: 'flex' }}>
            <Typography sx={{ mt: 2.5, mb: '10px' }} color="common.black">
              Rechercher un abonné
            </Typography>
          </div>
          <StyledAutocomplete
            getOptionLabel={option => `${option.firstName} ${option.lastName}`}
            disablePortal
            options={users}
            renderOption={(props, option) => (
              <StyledOptionBox key={option._id} onClick={() => setUserFocus(option)}>
                {`${option.firstName} ${option.lastName}`}
              </StyledOptionBox>
            )}
            sx={{ width: 300 }}
            renderInput={(params) => <StyledTextField {...params} label='Partenaire' />}
            noOptionsText='Aucun joueur'
          />
          <div
            style={{ display: 'flex', alignItems: 'flex-end', marginTop: '30px' }}
            onClick={() => setIsAddingUser(true)}
          >
            <span
              className={styles.linkProfile}
              style={{ marginRight: '10px' }}
            >
              Ajouter un nouvel abonné
            </span>
            <BsFillPlusCircleFill size='20px' color='black' />
          </div>
          <div
            style={{ display: 'flex', alignItems: 'flex-end', marginTop: '30px' }}
            onClick={() => setIsBatchBooking(true)}
          >
            <span
              className={styles.linkProfile}
              style={{ marginRight: '10px' }}
            >
              Réservations groupées
            </span>
            <BsFillPlusCircleFill size='20px' color='black' />
          </div>
        </>
      )
    }
  }

  if(isLoading || !users) {
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
    <>
      <div className='desktop-only tablet-only'>
        <Card sx={{ minWidth: 600, minHeight: 600 }}>
          <CardContent>
              <>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                    }}
                  >
                  <Typography variant="h4" component="div" color="common.black">
                    Page admin
                  </Typography>
                </div>
                {returnContent()}
              </>
          </CardContent>
        </Card>
      </div>
      <div className='mobile-only'>
        <Card sx={{ minWidth: '350px', minHeight: 600 }}>
          <CardContent>
              <>
                <div
                  style={{
                    width: '100%',
                    display: 'flex',
                    justifyContent: 'flex-start',
                    alignItems: 'center'
                    }}
                  >
                  <Typography variant="h4" component="div" color="common.black">
                    Page admin
                  </Typography>
                </div>
                {returnContent()}
              </>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Admin