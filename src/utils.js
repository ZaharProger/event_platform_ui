export const prepareDatetime = (datetime, isDatePicker = false) => {
    const datetimeObject = new Date(datetime * 1000)
    const preparedDate = isDatePicker ?
        [datetimeObject.getFullYear(), datetimeObject.getMonth() + 1, datetimeObject.getDate()].join('-')
        :
        datetimeObject.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })

    let hours = datetimeObject.getHours()
    hours = hours < 10 ? `0${hours}` : hours
    let minutes = datetimeObject.getMinutes()
    minutes = minutes < 10 ? `0${minutes}` : minutes
    const preparedTime = `${hours}:${minutes}`

    return `${preparedDate}${isDatePicker ? 'T' : ' '}${preparedTime}`
}