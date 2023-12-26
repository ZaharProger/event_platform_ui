import React, { useCallback, useState } from 'react'
import { Stack, TextField, useMediaQuery } from '@mui/material'
import useButton from '../../hooks/useButton'
import { assignButton, searchButton, unpinButton } from '../buttons'
import EventUserInfo from './EventUserInfo'

import { v4 as uuidV4 } from "uuid"
import ContentList from '../content/ContentList'
import ContentListItem from '../content/ContentListItem'
import useColors from '../../hooks/useColors'
import useValidation from '../../hooks/useValidation'

export default function EventUsersList(props) {
    const isMobile = useMediaQuery('(max-width: 1000px)')

    const [searchData, setSearchData] = useState('')

    const getButton = useButton(false)
    const button = getButton(
        searchButton, () => setSearchData(document.querySelector('#search').value)
    )
    const getColors = useColors()
    const buttonColors = getColors(searchButton)

    const textFieldStyles = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: buttonColors.color,
            '& fieldset': {
                borderColor: buttonColors.backgroundColor,
            },
            '&:hover fieldset': {
                borderColor: buttonColors.backgroundColor,
            },
            '&.Mui-focused fieldset': {
                borderColor: buttonColors[':hover'].backgroundColor,
            },
        }
    }

    const setResponsibleHandler = useCallback((userId, isResponsible) => {
        const newAssignation = props.assigned_users.map(user => {
            return {
                ...user
            }
        })

        let existingUserIndex = 0
        const existingUser = newAssignation.filter((user, i) => {
            const isEqualIds = user.user_id == userId
            if (isEqualIds) {
                existingUserIndex = i
            }

            return isEqualIds
        })

        if (existingUser.length != 0) {
            newAssignation[existingUserIndex].is_responsible = isResponsible
            props.assigned_users_callback(newAssignation)
        }
    }, [props.assigned_users])

    const responsibleUser = props.assigned_users
        .filter(assignedUser => assignedUser.is_responsible)[0]
    const currentResponsible = useValidation(responsibleUser, null)
    if (currentResponsible.get() !== responsibleUser) {
        currentResponsible.set(responsibleUser)
    }

    return (
        <Stack direction="column" spacing={4} paddingTop="20px" id="Event-users-list"
            justifyContent="center" alignItems="center" width="100%">
            <Stack spacing={2} direction={isMobile ? 'column' : 'row'} width="100%"
                justifyContent="space-between" alignItems="center">
                <TextField id="search" autoFocus
                    fullWidth label="ФИО исполнителя" variant="outlined"
                    color="secondary" sx={{ ...textFieldStyles }} />
                {
                    button
                }
            </Stack>
            {
                <ContentList data={props.users
                    .filter(eventUser => eventUser.user.name.includes(searchData) || searchData == '')
                    .map(eventUser => {
                        const foundAssignation = props.assigned_users
                            .filter(assignedUser => assignedUser.user_id == eventUser.user.id)                  

                        const buttons = []
                        if (props.user.is_staff) {
                            buttons.push(
                                getButton(
                                    foundAssignation.length != 0 ? unpinButton : assignButton,
                                    () => props.assign_callback(
                                        eventUser.user.id, 
                                        foundAssignation.length != 0
                                    )
                                )
                            )
                        }
  
                        return <ContentListItem key={`event_user_${uuidV4()}`} data={{
                            item_info: <EventUserInfo user={eventUser}
                                event_tasks={props.event_tasks}
                                assigned_user={foundAssignation.length != 0? foundAssignation[0] : null}
                                current_responsible={currentResponsible}
                                can_set_responsible={props.user.is_staff}
                                set_responsible_callback={(userId, responsibleState) => 
                                    setResponsibleHandler(userId, responsibleState)} />,
                            item_buttons: buttons
                        }} />
                    })} />
            }
        </Stack>
    )
}
