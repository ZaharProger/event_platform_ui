import { Stack, Typography } from '@mui/material'
import React, { useCallback } from 'react'
import useFields from '../../hooks/useFields'
import useTextFieldStyles from '../../hooks/useTextFieldStyles'
import { useTheme } from '@emotion/react'
import useButton from '../../hooks/useButton'
import { deleteTool } from '../toolbar/tools'
import useSync from '../../hooks/useSync'

export default function Money(props) {
    const theme = useTheme()

    const getFields = useFields()
    const styles = useTextFieldStyles('outlined', props.is_editable)

    const getTool = useButton(true)
    const syncFunction = useSync()

    const getTotal = useCallback(() => {
        const priceFields = props.data.filter(item => {
            const itemName = item.name.toLowerCase()
            return itemName.includes('количество') ||
                itemName.includes('цена') || itemName.includes('стоимость')
        })

        let total = 0
        if (priceFields.length != 0) {
            total = priceFields[0].value * priceFields[1].value
        }

        return total
    }, [props])

    return (
        <Stack direction="row"
            spacing={1} alignItems="center" justifyContent="center">
            {
                getTool(
                    deleteTool,
                    () => props.delete_callback(
                        (isRoadmap, dataToSync, currentData) => {
                            return syncFunction(isRoadmap, dataToSync, currentData)
                        }
                    ),
                    {
                        marginRight: 'auto!important',
                        display: 'flex'
                    }
                )
            }
            <Stack direction="column" spacing={1} bgcolor={theme.palette.primary.main}
                borderRadius="10px">
                <Stack spacing={2} direction="row" padding="10px"
                    alignItems="center">
                    {
                        getFields(
                            props.data,
                            styles,
                            props.is_editable
                        )
                    }
                </Stack>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Typography variant="subtitle2" color="primary" padding="5px 20px"
                        fontSize="0.85em" bgcolor={theme.palette.secondary.main}
                        borderRadius="10px 0 10px 0"
                        marginLeft="auto!important">
                        {
                            `Сумма: ${getTotal()}`
                        }
                    </Typography>
                </Stack>
            </Stack>
        </Stack>
    )
}
