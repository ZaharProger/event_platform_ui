import React from 'react'
import { Stack, Typography } from '@mui/material'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import LockIcon from '@mui/icons-material/Lock'

export default function EventShortInfo(props) {
    const {name, place, datetime_start, datetime_end, is_complete, secret_code} = props.data

    return (
        <Stack spacing={2} justifyContent="flex-start" alignItems="center">
            <Typography variant="subtitle1" color="secondary"
                display="block" sx={{fontWeight: 'bold'}}>
                {name}
            </Typography>
            <Typography variant="subtitle1" color="secondary" display="block">
                {place}
            </Typography>
            <Typography variant="subtitle1" color="secondary"
                display="block" sx={{marginTop: 20}}>
            {
                datetime_end !== null?
                `${datetime_start} - ${datetime_end}`
                :
                datetime_start
            }
            </Typography>
            {
                is_complete || secret_code !== null?
                <Stack direction="row" spacing={3} 
                    justifyContent="flex-end" alignItems="center">
                    {
                        is_complete?
                        <CheckCircleIcon color="success" />
                        :
                        null
                    }
                    {
                        secret_code !== null?
                        <LockIcon color="info" />
                        :
                        null
                    }
                </Stack>
                :
                null
            }
        </Stack>
    )
}
