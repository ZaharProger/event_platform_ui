import { Stack, Typography } from '@mui/material'
import React from 'react'

import { v4 as uuidV4 } from "uuid"

export default function EventInfoItem(props) {
    return (
        <Stack direction="column" spacing={0} marginRight="auto!important"
            justifyContent="flex-start" alignItems="center">
            <Typography variant="subtitle1" color="secondary"
                marginRight="auto!important" fontWeight="bold">
                {
                    props.item_name
                }
            </Typography>
            {
                props.item_values.map(itemValue => {
                    return <Typography key={`info_item_${uuidV4()}`} variant="subtitle1" 
                        color="secondary" marginRight="auto!important" fontSize="0.9em">
                        {
                            itemValue
                        }
                    </Typography>
                })
            }
        </Stack>
    )
}