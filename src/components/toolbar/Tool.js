import { Button, Checkbox, FormControlLabel, SvgIcon, Typography } from '@mui/material'
import React from 'react'
import { useSelector } from 'react-redux'

import { profileTool, toolTypes } from './tools'

export default function Tool(props) {
    const showCompletedEvents = useSelector(state => state.show_completed_events)
    const { label, icon, type, callback, colors, additional_styles } = props.data

    const checkBoxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        {label}
    </Typography>

    return (
        <div className="Tool" onClick={() => callback()} style={{
            marginLeft: props.data.label === profileTool.label ? 'auto' : 0
        }}>
            {
                type == toolTypes.checkbox ?
                    <FormControlLabel sx={{ display: 'flex', alignItems: 'center' }}
                        control={<Checkbox id="show-completed-events" checked={showCompletedEvents}
                            sx={{
                                color: colors.color,
                                "&.Mui-checked": {
                                    color: colors[':hover'].color,
                                }
                            }} />} label={checkBoxLabel} />
                    :
                    <Button sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        transition: '0.3s ease-out',
                        ...colors,
                        ...additional_styles
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
