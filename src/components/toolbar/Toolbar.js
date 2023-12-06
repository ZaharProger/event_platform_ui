import { AppBar, Slide, Stack, useScrollTrigger } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import {changePrevTrigger} from '../../redux/actions'

export default function Toolbar(props) {
    const trigger = useScrollTrigger()

    const prevTrigger = useSelector(state => state.trigger)
    const dispatch = useDispatch()

    if (prevTrigger != trigger) {
        dispatch(changePrevTrigger(trigger))
    }

    return (
        <Slide appear={false} direction="down" in={!trigger}>
            <AppBar position="sticky">
                <Stack direction="row" alignItems="center" padding="10px" overflow="auto">
                    {
                        props.tools
                    }
                </Stack>
            </AppBar>
        </Slide>
    )
}
