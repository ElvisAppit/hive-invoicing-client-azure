export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('hr-BA', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    // hour: '2-digit',
    // minute: '2-digit',
  })
}

export const findIndexById = (items: any, id: number) => {
  let index = -1
  for (let i = 0; i < items.length; i++) {
    if (items[i].contactId === id) {
      index = i
      break
    }
  }

  return index
}

export const emptyStringsToNull = (object: any) => {
  Object.keys(object).forEach((parameter) => {
    if (typeof object[parameter] == 'string')
      object[parameter] = !object[parameter] ? null : object[parameter]
  })
}

export function prepareDateFormat(date: string, viewFormat?: boolean) {
  const newDate = date !== '' ? date : new Date()
  const fullDate = new Date(newDate)
  const year = fullDate.getFullYear()
  const month =
    (fullDate.getMonth() + 1).toString().length === 1
      ? String(fullDate.getMonth() + 1).padStart(2, '0')
      : fullDate.getMonth() + 1
  const day =
    fullDate.getDay().toString().length === 1
      ? String(fullDate.getDate()).padStart(2, '0')
      : fullDate.getDate()

  if (viewFormat) {
    return `${day}/${month}/${year}`
  } else {
    return `${year}-${month}-${day}`
  }
}

export const round2Decimals = (value: number) => {
  return Math.round((value + Number.EPSILON) * 100) / 100
}
