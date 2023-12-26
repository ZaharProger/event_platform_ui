import React, { useCallback } from 'react'
import { Stack, Typography, FormControlLabel, Checkbox, useTheme } from '@mui/material'
import useColors from '../../hooks/useColors'
import { saveButton } from '../buttons'
import useValidation from '../../hooks/useValidation'

export default function EventUserInfo(props) {
    const { is_organizer, user: { id, name, email } } = props.user

    const theme = useTheme()

    const getColors = useColors()
    const buttonColors = getColors(saveButton)

    const checkboxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Назначить ответственным
    </Typography>

    const isResponsible = useValidation(props.assigned_user !== null ?
        props.assigned_user.is_responsible : false, null)
    
    const responsibleIdsEquals = props.current_responsible.get() !== undefined?
        props.current_responsible.get().user_id == id : true
    
    const getTaskStat = useCallback((as_str=false) => {
        const relatedTasksAmount = props.event_tasks
            .filter(eventTask => {
                return eventTask.users.filter(taskUser => taskUser.user.id == id).length != 0
            })
            .length

        return as_str? 
            `Задействован в ${relatedTasksAmount} из ${props.event_tasks.length} задач`
            :
            [relatedTasksAmount, props.event_tasks.length]
    }, [props])

    const getBusyColor = useCallback(() => {
        const [relatedTasksAmount, allTasksAmount] = getTaskStat()
        const taskStat = relatedTasksAmount / allTasksAmount
        
        return taskStat < 0.5 ?
            theme.palette.success.main
            :
            taskStat < 0.7 ?
                theme.palette.action.main
                :
                theme.palette.error.main
    }, [props])

    return (
        <Stack spacing={0} justifyContent="flex-start" alignItems="center" width="100%">
            <Typography variant="subtitle1" color="secondary" marginRight="auto!important"
                display="block" fontWeight="bold">
                {name}
            </Typography>
            <Typography variant="subtitle1" marginRight="auto!important"
                color="secondary" display="block" fontSize="0.9em">
                {email}
            </Typography>
            {
                props.assigned_user !== null && props.can_set_responsible && responsibleIdsEquals ?
                    <FormControlLabel sx={{
                        display: 'flex',
                        alignItems: 'center',
                        marginRight: 'auto!important'
                    }} control={<Checkbox id={`is_responsible_${id}`}
                        onChange={() => {
                            const newValue = !isResponsible.get()
                            isResponsible.set(newValue)
                            props.set_responsible_callback(id, newValue)
                            props.current_responsible.set(newValue? props.user : null)
                        }}
                        checked={isResponsible.get()}
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
                color="primary" padding="5px 10px" bgcolor={getBusyColor()} 
                borderRadius="20px 10px 10px 20px">
                {
                    getTaskStat(true)
                }
            </Typography>
            {
                is_organizer ?
                    <Typography variant="subtitle1" marginLeft="auto!important"
                        color="secondary" display="block" fontSize="0.8em">
                        Создатель мероприятия
                    </Typography>
                    :
                    null
            }
            {
                props.assigned_user !== null ?
                    props.assigned_user.is_responsible ?
                        <Typography variant="subtitle1" marginLeft="auto!important"
                            color="secondary" display="block" fontSize="0.8em">
                            Ответственное лицо
                        </Typography>
                        :
                        null
                    :
                    null
            }
        </Stack>
    )
}
