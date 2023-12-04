export const prepareDatetime = (datetime, isDatePicker = false) => {
    const datetimeObject = new Date(datetime * 1000)

    let preparedDate
    if (isDatePicker) {
        preparedDate = [datetimeObject.getFullYear(), datetimeObject.getMonth() + 1, datetimeObject.getDate()]
            .map(date => date < 10? `0${date}` : date)
            .join('-')
    }
    else {
        preparedDate = datetimeObject.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }

    const timeParts = [datetimeObject.getHours(), datetimeObject.getMinutes()]
    if (isDatePicker) {
        timeParts.push(datetimeObject.getSeconds())
    }
    const preparedTime = timeParts.map(time => time < 10 ? `0${time}` : time).join(':')

    return `${preparedDate}${isDatePicker ? 'T' : ' '}${preparedTime}`
}