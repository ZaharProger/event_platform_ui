import { Stack, Typography } from '@mui/material'
import React from 'react'

export default function EventForm(props) {
    return (
        <Stack spacing={1} direction="column" display="flex" marginRight="auto"
            justifyContent="center" alignItems="center">
                <Typography variant="body1" display="flex" color='secondary'
                    gutterBottom textAlign='start' fontWeight="bold">
                        Мероприятие
                </Typography>
                <div className="form-block" style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    marginBottom: 20
                }}>

                </div>
                <Typography variant="body1" display="flex" color='secondary'
                    gutterBottom textAlign='start' fontWeight="bold">
                        Организатор
                </Typography>
                <div className="form-block" style={
                    {display: 'flex', 
                    flexDirection: 'column'
                }}>
                    
                </div>
        </Stack>
    )
}
