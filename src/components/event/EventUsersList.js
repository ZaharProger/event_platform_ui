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
                        const assignedUser = props.assigned_users
                            .filter(assignedUserId => assignedUserId == user.user.id)
                        const isUserAssigned = assignedUser.length != 0

                        return <ContentListItem key={`event_user_${uuidV4()}`} data={{
                            item_info: <EventUserInfo user={user} />,
                            item_buttons: [
                                getButton(
                                    isUserAssigned? unpinButton : assignButton,
                                    () => props.assign_callback(user.user.id, isUserAssigned)
                                )
                            ]
                        }} />
                    })} />
            }
        </Stack>
    )
}
