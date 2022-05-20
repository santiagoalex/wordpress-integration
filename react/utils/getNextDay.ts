const getNextDay = (date: Date | undefined) => {
  if (date === undefined) return undefined

  const nextDay = new Date(date)
  nextDay.setDate(nextDay.getDate() + 1)
  return nextDay
}

export default getNextDay
