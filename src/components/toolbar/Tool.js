import { Button, Checkbox, FormControlLabel, SvgIcon, Typography } from '@mui/material'
import React from 'react'
import { profileTool, toolTypes } from './tools'

import useButtonColors from '../../hooks/useButtonColors'

export default function Tool(props) {
    const getButtonColors = useButtonColors()

    const {color, hoverColor} = getButtonColors(props.data)
    const {label, icon, type} = props.data

    const checkBoxLabel = <Typography variant="subtitle2" 
    fontSize="0.8em" color="secondary">
        {label}
    </Typography>

    return (
        <div className="Tool" style={{
            marginLeft: props.data === profileTool? 'auto' : 0
        }}>
            {
                type == toolTypes.checkbox?
                <FormControlLabel sx={{display: 'flex', alignItems: 'center'}} 
                control={<Checkbox sx={{
                    color,
                    "&.Mui-checked": {
                        color: hoverColor,
                    }
                }}/>} label={checkBoxLabel} />
                :
                <Button sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: '0.3s ease-out',
                    color,
                    ":hover": {
                        color: hoverColor
                    }
                }}>
                    {
                        icon !== null?
                        <SvgIcon sx={{fontSize: '2em'}} 
                            component={icon} inheritViewBox />
                        :
                        null
                    }
                    <Typography variant="subtitle2" display="block" fontSize="0.8em">
                        {label}
                    </Typography>
                </Button>
            }
        </div>
    )
}
