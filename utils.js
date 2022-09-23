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

export const getDatesInRange = (startDate, endDate) => {
  const date = new Date(startDate.getTime())
  const dates = []

  while (date <= endDate) {
    dates.push(new Date(date))
    date.setDate(date.getDate() + 1)
  }

  return dates
}