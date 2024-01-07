import { Stack, Typography, useTheme } from '@mui/material'
import React, { useCallback } from 'react'

import { v4 as uuidV4 } from "uuid"
import useTextFieldStyles from '../../hooks/useTextFieldStyles'
import useUsersList from '../../hooks/useUsersList'
import UsersListItem from '../usersList/UsersListItem'
import TaskStateFilter from '../task/TaskStateFilter'

export default function ModalBlockItem(props) {
    const blockContentType = props.type === undefined ? 'text' : props.type

    const theme = useTheme()
    const textFieldStyles = useTextFieldStyles('outlined')

    const getUsersList = useUsersList(false)

    const getSearchResults = useCallback((searchData) => {
        return props.item_values.length != 0 ?
            props.item_values[0]
                .filter(itemValue => itemValue.user.name.toLowerCase()
                    .includes(searchData.toLowerCase())
                )
                .sort((first, second) => first.user.name.localeCompare(second.user.name))
                .map(foundItem => {
                    return <UsersListItem key={`event_user_${uuidV4()}`}
                        for_task={false}
                        user={foundItem} />
                })
            :
            []
    }, [props.item_values])

    return (
        <Stack direction="column" spacing={1} marginRight="auto!important"
            justifyContent="flex-start" alignItems="center">
            <Typography variant="subtitle1" color="secondary"
                marginRight="auto!important" fontWeight="bold">
                {
                    props.item_name
                }
            </Typography>
            <Stack direction={blockContentType == 'date' ? 'row' : 'column'} spacing={2}
                marginRight="auto!important" justifyContent="center" alignItems="center"
                useFlexGap flexWrap="wrap">
                {
                    props.item_values.map(itemValue => {
                        let blockContent = null
                        const blockContentKey = `modal_item_${uuidV4()}`

                        switch (blockContentType) {
                            case 'checkbox':
                                const checkboxColor = theme.palette[itemValue.color].main

                                blockContent = <TaskStateFilter key={blockContentKey}
                                    color={checkboxColor} value={itemValue} />
                                break
                            case 'list':
                                blockContent = getUsersList(
                                    { text_field_styles: textFieldStyles },
                                    'search_filter',
                                    (searchData) => getSearchResults(searchData)
                                )
                                break
                            default:
                                blockContent = <Typography key={blockContentKey}
                                    variant="subtitle1"
                                    color="secondary"
                                    marginRight="auto!important"
                                    fontSize="0.9em">
                                    {
                                        itemValue
                                    }
                                </Typography>
                                break
                        }

                        return blockContent
                    })
                }
            </Stack>
        </Stack>
    )
}