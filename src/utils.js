export const prepareDatetime = (datetime) => {
    const datetimeObject = new Date(datetime * 1000)
    const preparedDate = datetimeObject.toLocaleDateString('ru-RU', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    let hours = datetimeObject.getHours()
    hours = hours < 10? `0${hours}` : hours
    let minutes = datetimeObject.getMinutes()
    minutes = minutes < 10? `0${minutes}` : minutes
    const preparedTime = `${hours}:${minutes}`

    return `${preparedDate} ${preparedTime}`
}