import { Button, Checkbox, FormControlLabel, SvgIcon, Typography } from '@mui/material'
import React from 'react'
import { profileTool, toolTypes } from './tools'

import useButtonColors from '../../hooks/useButtonColors'

export default function Tool(props) {
    const getButtonColors = useButtonColors()

    const {backgroundColor, color, hover} = getButtonColors(props.data)
    const {label, icon, type} = props.data

    return (
        <div className="Tool">
            {
                type == toolTypes.checkbox?
                <FormControlLabel control={<Checkbox />} label={label} />
                :
                <Button sx={{
                    display: 'flex',
                    marginLeft: props.data === profileTool? 'auto' : 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    transition: '0.3s ease-out',
                    backgroundColor,
                    color,
                    ":hover": hover
                }}>
                    {
                        icon !== null?
                        <SvgIcon sx={{marginBottom: 15}} component={icon} inheritViewBox />
                        :
                        null
                    }
                    <Typography variant="subtitle1" display="block">
                        {label}
                    </Typography>
                </Button>
            }
        </div>
    )
}
