import React, { useCallback } from 'react'
import { Stack, Typography, FormControlLabel, Checkbox, useTheme, useMediaQuery } from '@mui/material'

import useColors from '../../hooks/useColors'
import { saveButton } from '../buttons'
import useValidation from '../../hooks/useValidation'
import useButton from '../../hooks/useButton'
import { assignTool, unpinTool } from '../toolbar/tools'

export default function TaskUser(props) {
    const { is_responsible, user: { id, name, email } } = props.user

    const isMobile = useMediaQuery('(max-width: 1000px)')
    const theme = useTheme()

    const getTool = useButton(true)

    const getColors = useColors()
    const buttonColors = getColors(saveButton)

    const checkboxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Назначить ответственным
    </Typography>

    // const isResponsible = useValidation(props.assigned_user !== null ?
    //     props.assigned_user.is_responsible : false, null)

    // const responsibleIdsEquals = props.current_responsible.get() != null ?
    //     props.current_responsible.get().user.id == id : true

    // const getTaskStat = useCallback((as_str = false) => {
    //     const relatedTasksAmount = props.event_tasks
    //         .filter(eventTask => {
    //             return eventTask.users.filter(taskUser => taskUser.user.id == id).length != 0
    //         })
    //         .length

    //     return as_str ?
    //         `Задействован в ${relatedTasksAmount} из ${props.event_tasks.length} задач`
    //         :
    //         [relatedTasksAmount, props.event_tasks.length]
    // }, [props])

    // const getBusyColor = useCallback(() => {
    //     const [relatedTasksAmount, allTasksAmount] = getTaskStat()
    //     const taskStat = relatedTasksAmount / allTasksAmount

    //     return taskStat < 0.5 ?
    //         theme.palette.success.main
    //         :
    //         taskStat < 0.7 ?
    //             theme.palette.action.main
    //             :
    //             theme.palette.error.main
    // }, [props])

    return (
        <Stack direction={isMobile ? 'column' : 'row'} spacing={6}
            bgcolor={`${theme.palette.primary.main}`}
            padding="3px 20px"
            width="100%"
            borderRadius="10px"
            border={`2px solid ${theme.palette.secondary.main}`}
            justifyContent={isMobile? 'center' : 'space-between'} alignItems="center">
            <Stack spacing={0} justifyContent="flex-start"
                alignItems="center" width="100%">
                <Typography variant="subtitle1" color="secondary" marginRight="auto!important"
                    display="block" fontWeight="bold" fontSize="0.9em">
                    {name}
                </Typography>
                <Typography variant="caption" marginRight="auto!important"
                    color="secondary" display="block">
                    {email}
                </Typography>
                {
                    true ?
                        <FormControlLabel sx={{
                            display: 'flex',
                            alignItems: 'center',
                            marginRight: 'auto!important'
                        }} control={<Checkbox id={`is_responsible_${id}`}
                            onChange={() => {
                                // const newValue = !isResponsible.get()
                                // isResponsible.set(newValue)
                                // props.assign_callback(id, newValue)
                                // props.current_responsible.set(newValue ? props.user : null)
                            }}
                            checked={false}
                            sx={{
                                color: buttonColors.backgroundColor,
                                "&.Mui-checked": {
                                    color: buttonColors[':hover'].backgroundColor,
                                }
                            }} />}
                            label={checkboxLabel} />
                        :
                        null
                }
                <Typography variant="caption" marginLeft="auto!important" fontWeight="bold"
                    color="primary" padding="5px 10px"
                    borderRadius="20px 10px 10px 20px">
                    {
                        // getTaskStat(true)
                    }
                </Typography>
            </Stack>
            <Stack direction="column" spacing={1}
                justifyContent="center" alignItems="center" >
                    {
                        getTool(
                            props.is_assigned ? unpinTool : assignTool,
                            () => console.log(1)
                        )
                    }
            </Stack>
        </Stack>
    )
}