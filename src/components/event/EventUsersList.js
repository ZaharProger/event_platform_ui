import React, { useState } from 'react'
import { Stack, TextField, useMediaQuery } from '@mui/material'
import useButton from '../../hooks/useButton'
import { assignButton, searchButton, unpinButton } from '../buttons'
import EventUserInfo from './EventUserInfo'

import { v4 as uuidV4 } from "uuid"
import ContentList from '../content/ContentList'
import ContentListItem from '../content/ContentListItem'
import useColors from '../../hooks/useColors'

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

    return (
        <Stack direction="column" spacing={4} paddingTop="20px"
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
                    .filter(user => user.user.name.includes(searchData) || searchData == '')
                    .map(user => {
                        const isUserAssigned = props.assigned_users
                            .filter(assignedUserId => assignedUserId == user.user.id)
                            .length != 0
                        
                        const isResponsible = props.task.users
                            .filter(taskUser => taskUser.user.id == user.user.id && taskUser.is_responsible)
                            .length != 0

                        const buttons = []
                        if (props.is_organizer) {
                            buttons.push(
                                getButton(
                                    isUserAssigned? unpinButton : assignButton,
                                    () => props.assign_callback(user.user.id, isUserAssigned)
                                )
                            )
                        }

                        return <ContentListItem key={`event_user_${uuidV4()}`} data={{
                            item_info: <EventUserInfo user={user} 
                                is_edit={props.is_organizer}
                                is_responsible={isResponsible}
                                is_assigned={isUserAssigned} />,
                            item_buttons: buttons
                        }} />
                    })} />
            }
        </Stack>
    )
}
