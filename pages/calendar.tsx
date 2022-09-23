import * as React from 'react'
import { useEffect, useState } from 'react'
import { useContext } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell, { tableCellClasses } from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import { styled } from '@mui/material/styles'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import TextField from '@mui/material/TextField'
import frLocale from 'date-fns/locale/fr'

import { BookingContext } from '../contexts/BookingContext'
import { AuthContext } from '../contexts/AuthContext'
import { courtsNames, rowsReferences } from '../fixtures'

function createData(
  emptyCell: null,
  name: string,
  one: object,
  two: object,
  three: object,
  four: object,
  five: object,
  six: object,
  seven: object,
  eight: object,
  nine: object,
  ten: object,
  eleven: object,
  twelve: object,
  thirteen: object,
  fourteen: object,
  fifteen: object,
  sixteen: object,
  seventeen: object
) {
  return {
    emptyCell,
    name,
    one,   
    two,
    three,
    four,
    five,
    six,
    seven,
    eight,
    nine,
    ten,
    eleven,
    twelve,
    thirteen,
    fourteen,
    fifteen,
    sixteen,
    seventeen
  }
}

const StyledHeaderTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#C2C2C2',
    color: '#000',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  }
}))

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    minWidth: '90px !important',
    border: 0
  },
  "&:hover": {
    cursor: 'pointer'
  }
}))

const StyledTableCellBooked = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    backgroundColor: '#FF6F61',
    minWidth: '90px !important',
    border: 0
  }
}))

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#F0F0F0',
    border: 0
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#E8E8E8',
    border: 0
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}))

export default function Calendar({ onCellClick, onBookingUpdate }: any) {

  const [date, setDate] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  const {
    fetchBookings,
    setBookings,
    bookings
  } = useContext(BookingContext)
  const { user } = useContext(AuthContext)

  useEffect(() => {
    fetchBookings(date, localStorage.getItem('token'))
    .then((bookings: any) => {
      setBookings(bookings)
      setIsLoading(false)
    })
  }, [])

  const handleDateChange = (date: any) => {
    setIsLoading(true)
    setDate(date)
    fetchBookings(date, localStorage.getItem('token'))
    .then((bookings: any) => {
      setBookings(bookings)
      setIsLoading(false)
    })
  }

  const populateCalendarRows = (time: any, index: any) => {
    const slot = bookings && bookings.find((booking: any) => (booking.time === time && booking.court === index ))
    if(slot) {
      return slot
    } else {
      return {}
    }
  }

  const rows = [
    createData(null, '08:00-09:00', populateCalendarRows('08:00-09:00', 1), populateCalendarRows('08:00-09:00', 2), populateCalendarRows('08:00-09:00', 3), populateCalendarRows('08:00-09:00', 4), populateCalendarRows('08:00-09:00', 5), populateCalendarRows('08:00-09:00', 6), populateCalendarRows('08:00-09:00', 7), populateCalendarRows('08:00-09:00', 8), populateCalendarRows('08:00-09:00', 9), populateCalendarRows('08:00-09:00', 10), populateCalendarRows('08:00-09:00', 11), populateCalendarRows('08:00-09:00', 12), populateCalendarRows('08:00-09:00', 13), populateCalendarRows('08:00-09:00', 14), populateCalendarRows('08:00-09:00', 15), populateCalendarRows('08:00-09:00', 16), populateCalendarRows('08:00-09:00', 17)),
    createData(null, '09:00-10:00', populateCalendarRows('09:00-10:00', 1), populateCalendarRows('09:00-10:00', 2), populateCalendarRows('09:00-10:00', 3), populateCalendarRows('09:00-10:00', 4), populateCalendarRows('09:00-10:00', 5), populateCalendarRows('09:00-10:00', 6), populateCalendarRows('09:00-10:00', 7), populateCalendarRows('09:00-10:00', 8), populateCalendarRows('09:00-10:00', 9), populateCalendarRows('09:00-10:00', 10), populateCalendarRows('09:00-10:00', 11), populateCalendarRows('09:00-10:00', 12), populateCalendarRows('09:00-10:00', 13), populateCalendarRows('09:00-10:00', 14), populateCalendarRows('09:00-10:00', 15), populateCalendarRows('09:00-10:00', 16), populateCalendarRows('09:00-10:00', 17)),
    createData(null, '10:00-11:00', populateCalendarRows('10:00-11:00', 1), populateCalendarRows('10:00-11:00', 2), populateCalendarRows('10:00-11:00', 3), populateCalendarRows('10:00-11:00', 4), populateCalendarRows('10:00-11:00', 5), populateCalendarRows('10:00-11:00', 6), populateCalendarRows('10:00-11:00', 7), populateCalendarRows('10:00-11:00', 8), populateCalendarRows('10:00-11:00', 9), populateCalendarRows('10:00-11:00', 10), populateCalendarRows('10:00-11:00', 11), populateCalendarRows('10:00-11:00', 12), populateCalendarRows('10:00-11:00', 13), populateCalendarRows('10:00-11:00', 14), populateCalendarRows('10:00-11:00', 15), populateCalendarRows('10:00-11:00', 16), populateCalendarRows('10:00-11:00', 17)),
    createData(null, '11:00-12:00', populateCalendarRows('11:00-12:00', 1), populateCalendarRows('11:00-12:00', 2), populateCalendarRows('11:00-12:00', 3), populateCalendarRows('11:00-12:00', 4), populateCalendarRows('11:00-12:00', 5), populateCalendarRows('11:00-12:00', 6), populateCalendarRows('11:00-12:00', 7), populateCalendarRows('11:00-12:00', 8), populateCalendarRows('11:00-12:00', 9), populateCalendarRows('11:00-12:00', 10), populateCalendarRows('11:00-12:00', 11), populateCalendarRows('11:00-12:00', 12), populateCalendarRows('11:00-12:00', 13), populateCalendarRows('11:00-12:00', 14), populateCalendarRows('11:00-12:00', 15), populateCalendarRows('11:00-12:00', 16), populateCalendarRows('11:00-12:00', 17)),
    createData(null, '12:00-13:00', populateCalendarRows('12:00-13:00', 1), populateCalendarRows('12:00-13:00', 2), populateCalendarRows('12:00-13:00', 3), populateCalendarRows('12:00-13:00', 4), populateCalendarRows('12:00-13:00', 5), populateCalendarRows('12:00-13:00', 6), populateCalendarRows('12:00-13:00', 7), populateCalendarRows('12:00-13:00', 8), populateCalendarRows('12:00-13:00', 9), populateCalendarRows('12:00-13:00', 10), populateCalendarRows('12:00-13:00', 11), populateCalendarRows('12:00-13:00', 12), populateCalendarRows('12:00-13:00', 13), populateCalendarRows('12:00-13:00', 14), populateCalendarRows('12:00-13:00', 15), populateCalendarRows('12:00-13:00', 16), populateCalendarRows('12:00-13:00', 17)),
    createData(null, '13:00-14:00', populateCalendarRows('13:00-14:00', 1), populateCalendarRows('13:00-14:00', 2), populateCalendarRows('13:00-14:00', 3), populateCalendarRows('13:00-14:00', 4), populateCalendarRows('13:00-14:00', 5), populateCalendarRows('13:00-14:00', 6), populateCalendarRows('13:00-14:00', 7), populateCalendarRows('13:00-14:00', 8), populateCalendarRows('13:00-14:00', 9), populateCalendarRows('13:00-14:00', 10), populateCalendarRows('13:00-14:00', 11), populateCalendarRows('13:00-14:00', 12), populateCalendarRows('13:00-14:00', 13), populateCalendarRows('13:00-14:00', 14), populateCalendarRows('13:00-14:00', 15), populateCalendarRows('13:00-14:00', 16), populateCalendarRows('13:00-14:00', 17)),
    createData(null, '14:00-15:00', populateCalendarRows('14:00-15:00', 1), populateCalendarRows('14:00-15:00', 2), populateCalendarRows('14:00-15:00', 3), populateCalendarRows('14:00-15:00', 4), populateCalendarRows('14:00-15:00', 5), populateCalendarRows('14:00-15:00', 6), populateCalendarRows('14:00-15:00', 7), populateCalendarRows('14:00-15:00', 8), populateCalendarRows('14:00-15:00', 9), populateCalendarRows('14:00-15:00', 10), populateCalendarRows('14:00-15:00', 11), populateCalendarRows('14:00-15:00', 12), populateCalendarRows('14:00-15:00', 13), populateCalendarRows('14:00-15:00', 14), populateCalendarRows('14:00-15:00', 15), populateCalendarRows('14:00-15:00', 16), populateCalendarRows('14:00-15:00', 17)),
    createData(null, '15:00-16:00', populateCalendarRows('15:00-16:00', 1), populateCalendarRows('15:00-16:00', 2), populateCalendarRows('15:00-16:00', 3), populateCalendarRows('15:00-16:00', 4), populateCalendarRows('15:00-16:00', 5), populateCalendarRows('15:00-16:00', 6), populateCalendarRows('15:00-16:00', 7), populateCalendarRows('15:00-16:00', 8), populateCalendarRows('15:00-16:00', 9), populateCalendarRows('15:00-16:00', 10), populateCalendarRows('15:00-16:00', 11), populateCalendarRows('15:00-16:00', 12), populateCalendarRows('15:00-16:00', 13), populateCalendarRows('15:00-16:00', 14), populateCalendarRows('15:00-16:00', 15), populateCalendarRows('15:00-16:00', 16), populateCalendarRows('15:00-16:00', 17)),
    createData(null, '16:00-17:00', populateCalendarRows('16:00-17:00', 1), populateCalendarRows('16:00-17:00', 2), populateCalendarRows('16:00-17:00', 3), populateCalendarRows('16:00-17:00', 4), populateCalendarRows('16:00-17:00', 5), populateCalendarRows('16:00-17:00', 6), populateCalendarRows('16:00-17:00', 7), populateCalendarRows('16:00-17:00', 8), populateCalendarRows('16:00-17:00', 9), populateCalendarRows('16:00-17:00', 10), populateCalendarRows('16:00-17:00', 11), populateCalendarRows('16:00-17:00', 12), populateCalendarRows('16:00-17:00', 13), populateCalendarRows('16:00-17:00', 14), populateCalendarRows('16:00-17:00', 15), populateCalendarRows('16:00-17:00', 16), populateCalendarRows('16:00-17:00', 17)),    
    createData(null, '17:00-18:00', populateCalendarRows('17:00-18:00', 1), populateCalendarRows('17:00-18:00', 2), populateCalendarRows('17:00-18:00', 3), populateCalendarRows('17:00-18:00', 4), populateCalendarRows('17:00-18:00', 5), populateCalendarRows('17:00-18:00', 6), populateCalendarRows('17:00-18:00', 7), populateCalendarRows('17:00-18:00', 8), populateCalendarRows('17:00-18:00', 9), populateCalendarRows('17:00-18:00', 10), populateCalendarRows('17:00-18:00', 11), populateCalendarRows('17:00-18:00', 12), populateCalendarRows('17:00-18:00', 13), populateCalendarRows('17:00-18:00', 14), populateCalendarRows('17:00-18:00', 15), populateCalendarRows('17:00-18:00', 16), populateCalendarRows('17:00-18:00', 17)),
    createData(null, '18:00-19:00', populateCalendarRows('18:00-19:00', 1), populateCalendarRows('18:00-19:00', 2), populateCalendarRows('18:00-19:00', 3), populateCalendarRows('18:00-19:00', 4), populateCalendarRows('18:00-19:00', 5), populateCalendarRows('18:00-19:00', 6), populateCalendarRows('18:00-19:00', 7), populateCalendarRows('18:00-19:00', 8), populateCalendarRows('18:00-19:00', 9), populateCalendarRows('18:00-19:00', 10), populateCalendarRows('18:00-19:00', 11), populateCalendarRows('18:00-19:00', 12), populateCalendarRows('18:00-19:00', 13), populateCalendarRows('18:00-19:00', 14), populateCalendarRows('18:00-19:00', 15), populateCalendarRows('18:00-19:00', 16), populateCalendarRows('18:00-19:00', 17)),
    createData(null, '19:00-20:00', populateCalendarRows('19:00-20:00', 1), populateCalendarRows('19:00-20:00', 2), populateCalendarRows('19:00-20:00', 3), populateCalendarRows('19:00-20:00', 4), populateCalendarRows('19:00-20:00', 5), populateCalendarRows('19:00-20:00', 6), populateCalendarRows('19:00-20:00', 7), populateCalendarRows('19:00-20:00', 8), populateCalendarRows('19:00-20:00', 9), populateCalendarRows('19:00-20:00', 10), populateCalendarRows('19:00-20:00', 11), populateCalendarRows('19:00-20:00', 12), populateCalendarRows('19:00-20:00', 13), populateCalendarRows('19:00-20:00', 14), populateCalendarRows('19:00-20:00', 15), populateCalendarRows('19:00-20:00', 16), populateCalendarRows('19:00-20:00', 17)),
    createData(null, '20:00-21:00', populateCalendarRows('20:00-21:00', 1), populateCalendarRows('20:00-21:00', 2), populateCalendarRows('20:00-21:00', 3), populateCalendarRows('20:00-21:00', 4), populateCalendarRows('20:00-21:00', 5), populateCalendarRows('20:00-21:00', 6), populateCalendarRows('20:00-21:00', 7), populateCalendarRows('20:00-21:00', 8), populateCalendarRows('20:00-21:00', 9), populateCalendarRows('20:00-21:00', 10), populateCalendarRows('20:00-21:00', 11), populateCalendarRows('20:00-21:00', 12), populateCalendarRows('20:00-21:00', 13), populateCalendarRows('20:00-21:00', 14), populateCalendarRows('20:00-21:00', 15), populateCalendarRows('20:00-21:00', 16), populateCalendarRows('20:00-21:00', 17)),
    createData(null, '21:00-22:00', populateCalendarRows('21:00-22:00', 1), populateCalendarRows('21:00-22:00', 2), populateCalendarRows('21:00-22:00', 3), populateCalendarRows('21:00-22:00', 4), populateCalendarRows('21:00-22:00', 5), populateCalendarRows('21:00-22:00', 6), populateCalendarRows('21:00-22:00', 7), populateCalendarRows('21:00-22:00', 8), populateCalendarRows('21:00-22:00', 9), populateCalendarRows('21:00-22:00', 10), populateCalendarRows('21:00-22:00', 11), populateCalendarRows('21:00-22:00', 12), populateCalendarRows('21:00-22:00', 13), populateCalendarRows('21:00-22:00', 14), populateCalendarRows('21:00-22:00', 15), populateCalendarRows('21:00-22:00', 16), populateCalendarRows('21:00-22:00', 17)),
  ]

  const returnBookedWording = (booking: any) => {
    const { player1, player2 } = booking
    if(player1?._id === user?._id || player2?._id === user?._id) {
      return 'Moi'
    } else {
      return 'Réservé'
    }
  }

  const returnBookedClassName = (booking:any) => {
    const { player1, player2 } = booking
    if(player1?._id === user?._id || player2?._id === user?._id) {
      return 'my-booking-cell'
    } else {
      return ''
    }
  }

  const handleBookedCellClickAction = (booking: any) => {
    const { player1, player2 } = booking
    if(player1?._id === user?._id || player2?._id === user?._id) {
      onBookingUpdate(booking)
      return
    } else {
      return
    }
  }

  if(isLoading) {
    return(
      <div></div>
    )
  }

  return (
    <div>
      <div className='date-picker-row'>
       <span className='select-date-title'>Sélectionner une date : </span>
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={frLocale}>
          <DesktopDatePicker
            // label="Choisir une date"
            inputFormat="dd/MM/yyyy"
            value={date}
            onChange={(date: any) => handleDateChange(date)}
            renderInput={(params: any) => <TextField {...params} />}
            minDate={new Date()}
          />
        </LocalizationProvider>
      </div>
      <TableContainer
        sx={{ width: '100%', maxHeight: window.innerWidth < 1280 ? 550 : 700 }}
      >
        <Table
          stickyHeader
          aria-label="simple table"
          size='small'
        >
          <TableHead>
            <TableRow>
              { courtsNames.map((courtName, i) => (
                <StyledHeaderTableCell key={i} size='small' align="left">
                  {courtName}
                </StyledHeaderTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row: any) => (
                <StyledTableRow
                  key={row.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  {
                    rowsReferences.map((rowReference, index) => {
                      if(row[rowReference]._id) {
                        return (
                          <StyledTableCellBooked
                            key={index}
                            onClick={() => handleBookedCellClickAction(row[rowReference])}
                            className='rowCell'
                            size='small'
                            align="left"
                          >
                            <div className={returnBookedClassName(row[rowReference])}>
                              {returnBookedWording(row[rowReference])}
                            </div>
                          </StyledTableCellBooked>
                        )
                      }
                      return (
                        <StyledTableCell
                          key={index}
                          onClick={() => {
                            onCellClick({
                              court: index,
                              time: row.name,
                              date
                            })
                          }}
                          className='rowCell'
                          size='small'
                          align="left"
                        >
                          Libre
                        </StyledTableCell>
                      )
                    })
                  }
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}