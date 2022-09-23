import React, { createContext, useState } from 'react'
import axios from 'axios'
import { dateFormatter } from '../utils'

const { NEXT_PUBLIC_API_URL } = process.env
export const BookingContext = createContext()

// SETUP CONFIG HEADERS AND TOKEN
export const tokenConfig = token => {
	// HEADERS
	const config = {
		headers: {
			"Content-type": "application/json"
		}
	}
	if (token) {
		config.headers['x-auth-token'] = token
	}
	return config
}

const BookingContextProvider = (props) => {

  const [bookings, setBookings] = useState([])

    // CREATE BOOKING
    const createBooking = async (
      date,
      time,
      court,
      player1,
      player2,
      isAdminBooking,
      token
    ) => {
      const formattedDate = dateFormatter(date)
      // BODY
      const body = JSON.stringify({
        date: formattedDate,
        time,
        court,
        player1,
        player2,
        isAdminBooking
      })
      try {
        const response = await axios.post(`${NEXT_PUBLIC_API_URL}/bookings`, body, tokenConfig(token))
        return response
      } catch (err) {
        console.log(err)
        return {
          msg: err?.response?.data?.msg,
          status: 400
        }
      }
    }

    // FETCH BOOKINGS OF A SPECIFIC DATE
    const fetchBookings = async (date, token) => {
      const formattedDate = dateFormatter(new Date(date))
      try {
        const response = await axios.get(`${NEXT_PUBLIC_API_URL}/bookings?date=${formattedDate}`, tokenConfig(token))
        setBookings(response.data)
        return response.data
      } catch (err) {
        console.log(err)
        return err
      }
    }

    //  DELETE A SPECIFIC BOOKING
    const deleteBooking = async (date, _id, user_id, token) => {
      try {
        const response = await axios.delete(`${NEXT_PUBLIC_API_URL}/bookings?_id=${_id}&user_id=${user_id}`, tokenConfig(token))
        fetchBookings(date, token)
        return response
      } catch (err) {
        console.log(err)
        return {
          msg: err?.response?.data?.msg,
          status: 400
        }
      }
    }

    // CREATE BATCH BOOKING
    const createBatchBooking = async (
      courts,
      hours,
      dates,
      isAdminBooking,
      token,
      player1
    ) => {
      // BODY
      const body = JSON.stringify({
        courts,
        hours,
        dates: dates.map(date => dateFormatter(date)),
        isAdminBooking,
        player1
      })
      try {
        const response = await axios.post(`${NEXT_PUBLIC_API_URL}/bookings/batch`, body, tokenConfig(token))
        return response.data
      } catch (err) {
        console.log(err)
        return {
          msg: err?.response?.data?.msg,
          status: 400
        }
      }
    }

    //  DELETE BATCH BOOKING
    const deleteBatchBooking = async (
      courts,
      hours,
      dates,
      isAdminBooking,
      player1,
      token
    ) => {
      // BODY
      const body = JSON.stringify({
        courts,
        hours,
        dates: dates.map(date => dateFormatter(date)),
        isAdminBooking,
        player1
      })
      try {
        const response = await axios.put(`${NEXT_PUBLIC_API_URL}/bookings/batch`,body, tokenConfig(token))
        return response.data
      } catch (err) {
        console.log(err)
        return {
          msg: err?.response?.data?.msg,
          status: 400
        }
      }
    }

    return (
      <BookingContext.Provider
        value={{
          bookings,
          createBooking,
          createBatchBooking,
          fetchBookings,
          setBookings,
          deleteBooking,
          deleteBatchBooking
        }}
      >
        {props.children}
      </BookingContext.Provider>
    )
}

export default BookingContextProvider