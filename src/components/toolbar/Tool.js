import { Button, Checkbox, FormControlLabel, SvgIcon, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { profileTool, toolTypes } from './tools'
import useTool from '../../hooks/useTool'

export default function Tool(props) {
    const showCompletedEvents = useSelector(state => state.show_completed_events)

    const navigate = useNavigate()
    const getToolColors = useTool()

    const toolColors = getToolColors(props.data)
    const { label, icon, type, route } = props.data

    const checkBoxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        {label}
    </Typography>

    const toolClickHandler = useCallback(() => {
        if (props.data.callback != undefined) {
            props.data.callback()
        }
        else {
            if (route !== null) {
                navigate(route)
            }
        }
    }, [props.data])

    return (
        <div className="Tool" onClick={() => toolClickHandler()} style={{
            marginLeft: props.data === profileTool ? 'auto' : 0
        }}>
            {
                type == toolTypes.checkbox ?
                    <FormControlLabel sx={{ display: 'flex', alignItems: 'center' }}
                        control={<Checkbox id="show-completed-events" checked={showCompletedEvents}
                            sx={{
                                color: toolColors.color,
                                "&.Mui-checked": {
                                    color: toolColors[':hover'].color,
                                }
                            }} />} label={checkBoxLabel} />
                    :
                    <Button sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: '0.3s ease-out',
                        ...toolColors
                    }}>
                        {
                            icon !== null ?
                                <SvgIcon sx={{ fontSize: '2em' }}
                                    component={icon} inheritViewBox />
                                :
                                null
                        }
                        {
                            label !== null ?
                                <Typography variant="subtitle2" display="block" fontSize="0.8em">
                                    {label}
                                </Typography>
                                :
                                null
                        }
                    </Button>
            }
        </div>
    )
}
