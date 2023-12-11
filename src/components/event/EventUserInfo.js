import React from 'react'
import { Stack, Typography, FormControlLabel, Checkbox } from '@mui/material'
import useColors from '../../hooks/useColors'
import { saveButton } from '../buttons'
import useValidation from '../../hooks/useValidation'

export default function EventUserInfo(props) {
    const { is_organizer, user: { name, email } } = props.user

    const getColors = useColors()
    const buttonColors = getColors(saveButton)

    const checkboxLabel = <Typography variant="subtitle2"
        fontSize="0.8em" color="secondary">
        Назначен ответственным
    </Typography>

    const isResponsible = useValidation(props.is_responsible, null)

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
                props.is_assigned && props.is_edit?
                    <FormControlLabel sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginRight: 'auto!important' 
                    }}  control={<Checkbox id="is_responsible"
                            onChange={() => isResponsible.set(!isResponsible.get())}
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
        </Stack>
    )
}
