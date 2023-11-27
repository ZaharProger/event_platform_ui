import { Button, Stack } from '@mui/material'
import React from 'react'

import {v4 as uuidV4} from "uuid"
import useButtonColors from '../../hooks/useButtonColors'

export default function ListItemButtons(props) {
    const getButtonColors = useButtonColors()

    return (
        <Stack direction="row" spacing={3} 
            justifyContent="center" alignItems="center">
                {
                    props.buttons.map(button => {
                        const {backgroundColor, color, hover} = getButtonColors(button)

                        return <Button key={`button_${uuidV4()}`} 
                            variant="contained" startIcon={button.icon}
                            sx={{
                                backgroundColor,
                                color,
                                transition: '0.3s ease-out',
                                ":hover": hover
                            }}>
                            {
                                button.label
                            }
                        </Button>
                    })
                }
        </Stack>
    )
}
