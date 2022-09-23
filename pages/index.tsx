import { NextPage } from 'next'
import { useState, useContext } from 'react'
import { BallTriangle } from 'react-loader-spinner'

import Calendar from './calendar'
import Signin from './signin'
import { AuthContext } from '../contexts/AuthContext'
import BookingDialog from '../components/BookingDialog'
import { UsersContext } from '../contexts/UsersContext'
import { BookingContext } from '../contexts/BookingContext'
import { ToastContext } from '../contexts/ToastContext'

const Home: NextPage = () => {

  const { user } = useContext(AuthContext)
  const { users } = useContext(UsersContext)
  const {
    fetchBookings,
    setBookings
  } = useContext(BookingContext)
  const { addToast } = useContext(ToastContext)

  const [isLoading, setIsLoading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [bookingInfo, setBookingInfo] = useState({})
  const [isUpdatingBooking, setIsUpdatingBooking] = useState(false)

  if(isLoading && !user) {
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

  const handleBookingCreationOrDeletion = (date: any) => {
    fetchBookings(date, localStorage.getItem('token'))
    setBookings()
    setIsDialogOpen(false)
  }

  const handleCellClick = (info: object) => {
    setIsUpdatingBooking(false)
    setBookingInfo(info)
    setIsDialogOpen(true)
  }


  if(!user || (user && user.email.length === 0)) {
    return <Signin />
  }

  return (
    <>
      <div style={{ padding: '1% 0', width: '100%' }}>
        <Calendar
          onCellClick={(info: object) => handleCellClick(info)}
          onBookingUpdate={(booking: object) => {
            handleCellClick(booking)
            setIsUpdatingBooking(true)
          }}
       /> 
      </div>
      <BookingDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        users={users.filter((player: any) => player._id !== user._id)}
        bookingInfo={bookingInfo}
        onBookingCreated={(date: any) => {
          handleBookingCreationOrDeletion(date)
          addToast('Réservation enregistrée')
        }}
        isUpdatingBooking={isUpdatingBooking}
        onBookingDeleted={(date: any) => {
          handleBookingCreationOrDeletion(date)
          addToast('Réservation suprimée')
        }}
      />
    </>
  )
}

export default Home
