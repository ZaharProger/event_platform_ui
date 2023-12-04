import { AppBar, Slide, Stack, useScrollTrigger } from '@mui/material'
import React from 'react'

export default function Toolbar(props) {
    const trigger = useScrollTrigger()

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar position="sticky">
                <Stack direction="row" alignItems="center" padding="2px 10px" overflow="auto">
                    {
                        props.tools
                    }
                </Stack>
            </AppBar>
        </Slide>
    )
}
