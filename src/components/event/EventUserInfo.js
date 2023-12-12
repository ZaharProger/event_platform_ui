import React from 'react'
import { Stack, Typography, FormControlLabel, Checkbox } from '@mui/material'
import useColors from '../../hooks/useColors'
import { saveButton } from '../buttons'
import useValidation from '../../hooks/useValidation'

export default function EventUserInfo(props) {
    const { is_organizer, user: { id, name, email } } = props.user

    const getColors = useColors()
    const buttonColors = getColors(saveButton)

    const checkboxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Назначить ответственным
    </Typography>

    const isResponsible = useValidation(props.assigned_user !== null ?
        props.assigned_user.is_responsible : false, null)
    
    const responsibleIdsEquals = props.current_responsible.get() != null?
        props.current_responsible.get().user.id == id : true

    return (
        <Stack spacing={1} justifyContent="flex-start" alignItems="center" width="100%">
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
                            props.assign_callback(id, newValue)
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
