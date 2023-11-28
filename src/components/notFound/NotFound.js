import { Stack, Typography } from '@mui/material'
import React from 'react'
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied'

export default function NotFound(props) {
    return (
        <Stack spacing={3} justifyContent="center" alignItems="center">
            <SentimentVeryDissatisfiedIcon color="secondary" sx={{
                fontSize: '3.5em',
            }} />
            <Typography variant='subtitle1' display="block"
                gutterBottom color="secondary" textAlign="center">
                    Ничего не найдено!
                    <br />
                    {
                        props.additional_caption
                    }
            </Typography>
        </Stack>
    )
}
