import { Button, Stack, SvgIcon } from '@mui/material'
import React from 'react'

import {v4 as uuidV4} from "uuid"
import useButton from '../../hooks/useButton'

export default function ListItemButtons(props) {
    const getButtonColors = useButton()

    return (
        <Stack direction="row" spacing={3} 
            justifyContent="center" alignItems="center">
                {
                    props.buttons.map(button => {
                        const buttonColors = getButtonColors(button)

                        return <Button key={`button_${uuidV4()}`} 
                            variant="contained" startIcon={<SvgIcon inheritViewBox component={button.icon} />}
                            sx={{
                                transition: '0.3s ease-out',
                                ...buttonColors
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
