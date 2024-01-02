import {
    Checkbox, FormControlLabel,
    Stack, TextField, Typography, useTheme
} from '@mui/material'
import React, { useCallback, useState } from 'react'

import { v4 as uuidV4 } from "uuid"
import useTextFieldStyles from '../../hooks/useTextFieldStyles'
import { prepareDatetime } from '../../utils'
import useUsersList from '../../hooks/useUsersList'
import TaskUser from '../task/TaskUser'

export default function ModalBlockItem(props) {
    const blockContentType = props.type === undefined ? 'text' : props.type

    const theme = useTheme()
    const textFieldStyles = useTextFieldStyles('outlined')

    const [checkedItems, setCheckedItems] = useState(Array())

    const getUsersList = useUsersList(false)

    const getSearchResults = useCallback((searchData) => {
        return props.item_values
            .filter(itemValue => itemValue.user.name.toLowerCase()
                .includes(searchData.toLowerCase())
            )
            .sort((first, second) => first.user.name.localeCompare(second.user.name))
            .map(foundItem => {
                return <TaskUser key={`event_user_${uuidV4()}`} user={foundItem}
                    update_callback={(newData) => console.log(1)} />
            })
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
            <Stack direction="column" spacing={2}
                marginRight="auto!important" justifyContent="center" alignItems="center"
                useFlexGap flexWrap="wrap">
                {
                    props.item_values.map(itemValue => {
                        let blockContent = null
                        const blockContentKey = `modal_item_${uuidV4()}`

                        switch (blockContentType) {
                            case 'checkbox':
                                const checkboxColor = theme.palette[itemValue.color].main

                                blockContent = <FormControlLabel key={blockContentKey}
                                    sx={{ marginRight: 'auto!important' }}
                                    control={
                                        <Checkbox checked={checkedItems.includes(checkboxColor)}
                                            onChange={(_, checked) => {
                                                setCheckedItems(
                                                    !checked ?
                                                        checkedItems.filter(checkedItem => {
                                                            return checkedItem != checkboxColor
                                                        })
                                                        :
                                                        [...checkedItems, checkboxColor]
                                                )
                                            }}
                                            sx={{
                                                color: theme.palette.primary.main,
                                                "&.Mui-checked": {
                                                    color: theme.palette.action.main,
                                                }
                                            }} />
                                    } label={
                                        <Typography variant="subtitle2"
                                            sx={{
                                                padding: '2px 10px',
                                                backgroundColor: `${checkboxColor}AA`,
                                                borderRadius: '10px'
                                            }}
                                            fontSize="0.8em" color="secondary">
                                            {
                                                itemValue.value
                                            }
                                        </Typography>
                                    } />
                                break
                            case 'date':
                                blockContent = <TextField type="datetime-local"
                                    key={blockContentKey}
                                    defaultValue={prepareDatetime('0', true)}
                                    helperText={<Typography variant="subtitle2"
                                        fontSize="0.8em" color="secondary">
                                        {
                                            itemValue
                                        }
                                    </Typography>} variant="outlined"
                                    color="secondary" sx={{ ...textFieldStyles }} />
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