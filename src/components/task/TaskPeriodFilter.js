import { TextField, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'

import { prepareDatetime } from '../../utils'

export default function TaskPeriodFilter(props) {
    const [localPeriod, setLocalPeriod] = useState(props.limit !== undefined ?
        props.limit : '')

    useEffect(() => {
        const periodsInput = document
            .querySelector('#Filter-modal')
            .querySelectorAll('input[type=datetime-local]')[props.index]
 
        if (periodsInput !== undefined) {
            periodsInput.value = prepareDatetime(localPeriod, true)
        }
        
    }, [props.index, localPeriod])

    return (
        <TextField type="datetime-local"
            defaultValue={prepareDatetime(props.limit !== undefined ? props.limit : '', true)}
            onChange={(event) => setLocalPeriod(event.target.value)}
            helperText={<Typography variant="subtitle2"
                fontSize="0.8em" color="secondary">
                {
                    props.value
                }
            </Typography>} variant="outlined"
            color="secondary" sx={{ ...props.text_field_styles }} />
    )
}