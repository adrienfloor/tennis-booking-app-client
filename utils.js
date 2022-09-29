import moment from 'moment'

export const dateFormatter = rawDate => {
  // ✅ Reset a Date's time to midnight
  rawDate.setHours(0, 0, 0, 0);

  // ✅ Format a date to YYYY-MM-DD (or any other format)
  function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
  }

  function formatDate(date) {
    return [
      date.getFullYear(),
      padTo2Digits(date.getMonth() + 1),
      padTo2Digits(date.getDate()),
    ].join('-')
  }

  return formatDate(rawDate)
}

export const nbrOfDaysToThisDate = date => {
  const today = new Date()
  const days = (date, today) =>{
    let difference = date.getTime() - today.getTime()
    let TotalDays = Math.ceil(difference / (1000 * 3600 * 24))
    return TotalDays
  }
  return days(date, today)
}

export const returnDateInOneYear = () => {
  const date = new Date()
  const dateInOneYear = date.setFullYear(date.getFullYear() + 1)
  return dateInOneYear
}

export const dateInOneMonth = date => {
  const dateInOneMOnth = new Date(date.setMonth(date.getMonth()+1))
  return dateInOneMOnth
}

export const dateInTwoMonths = date => {
  const dateInTwoMOnths = new Date(date.setMonth(date.getMonth()+2))
  return dateInTwoMOnths
}

export const dateInTwoDays = date => {
  const dateInTwoDays = date.setDate(date.getDate() + 2)
  return dateInTwoDays
}

export const getDatesInRange = (startDate, endDate) => {
  const date = new Date(startDate.getTime())
  const dates = []

  while (date <= endDate) {
    dates.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return dates
}

// validate string longer than 5 characters
export const isValidStringLength = (input, length) => {
	if (input.length >= length) {
		return true
	}
	return false
}

// validate email
export const isValidEmailInput = email => {
	//eslint-disable-next-line
	const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regEx.test(String(email).toLowerCase())
}


// validate password
export const isValidPassword = password => {
	let result = []
	const oneNumberRegEx = /\d/
	if (oneNumberRegEx.test(password)) {
		result.push('number')
	}
	const oneUppercaseRegEx = /^(?=.*[A-Z])/
	if (oneUppercaseRegEx.test(password)) {
		result.push('uppercase')
	}
	if (password.length >= 8) {
		result.push('length')
	}
	return result
}

// validate phone number

export const isValidPhoneNumber = phoneNumber => {
  const regEx = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s]*\d{2}){4}$/
  return regEx.test(phoneNumber)
}

// test if same string

export const isSameString = (string1, string2) => {
	if (string1.toLowerCase() === string2.toLowerCase()) {
		return true
	}
	return false
}

// test if a number is even or odd

export const isEven = (n) => {
	return Number(n) % 2 === 0
}

export const isValidDate = date => {
  const regEx = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/
  return regEx.test(date)
}