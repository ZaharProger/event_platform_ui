import { Checkbox, FormControlLabel, Typography, useTheme } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { changeFilterStates } from '../../redux/actions'

export default function TaskStateFilter(props) {
    const theme = useTheme()

    const dispatch = useDispatch()
    const taskStates = useSelector(state => state.filter_states)

    return (
        <FormControlLabel sx={{ marginRight: 'auto!important' }}
            control={
                <Checkbox checked={taskStates.includes(props.value.value)}
                    onChange={(_, checked) => {
                        dispatch(
                            changeFilterStates(
                                checked ?
                                    [...taskStates, props.value.value]
                                    :
                                    taskStates.filter(taskState => {
                                        return taskState != props.value.value
                                    })
                            )
                        )
                    }}
                    sx={{
                        color: theme.palette.secondary.main,
                        "&.Mui-checked": {
                            color: theme.palette.action.main,
                        }
                    }} />
            } label={
                <Typography variant="subtitle2"
                    sx={{
                        padding: '2px 10px',
                        backgroundColor: `${props.color}AA`,
                        borderRadius: '10px'
                    }}
                    fontSize="0.8em" color="secondary">
                    {
                        props.value.value
                    }
                </Typography>
            } />
    )
}
