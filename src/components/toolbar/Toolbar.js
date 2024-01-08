import { AppBar, Slide, Stack, useScrollTrigger, Typography } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { changePrevTrigger } from '../../redux/actions'

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
                {
                    props.nested_task !== null ?
                        <Typography variant="subtitle1" fontWeight="bold"
                            fontSize="1.2em" marginRight="auto!important"
                            padding="20px 10px" overflow="auto"
                            color="secondary" textAlign="center">
                            {
                                props.nested_task.name
                            }
                        </Typography>
                        :
                        <Stack direction="row" alignItems="center"
                            padding="10px" overflow="auto">
                            {
                                props.tools
                            }
                        </Stack>
                }
            </AppBar>
        </Slide>
    )
}
