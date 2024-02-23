import { Fade, Stack, Typography } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import useFields from '../../hooks/useFields'
import useTextFieldStyles from '../../hooks/useTextFieldStyles'
import { useTheme } from '@emotion/react'
import useButton from '../../hooks/useButton'
import { deleteTool } from '../toolbar/tools'
import useSync from '../../hooks/useSync'
import { useDispatch } from 'react-redux'
import { changeMoneyTotal } from '../../redux/actions'

export default function Money(props) {
    const theme = useTheme()

    const getFields = useFields()
    const styles = useTextFieldStyles('outlined', props.is_editable)

    const getTool = useButton(true)
    const syncFunction = useSync()

    const dispatch = useDispatch()

    const getTotal = useCallback((fieldsData=[]) => {
        let fields
        if (fieldsData.length != 0) {
            fields = fieldsData
        }
        else {
            fields = props.data.fields.filter(item => {
                const itemName = item.name.toLowerCase()
                return itemName.includes('количество') ||
                    itemName.includes('цена') || itemName.includes('стоимость')
            })
        }

        let total = 0
        if (fields.length != 0) {
            total = fields[0].value * fields[1].value
        }

        return total.toFixed(2)
    }, [props])

    const updateItemTotal = useCallback((callField={}) => {
        const inputs = []
        let totalLabel = null

        document.querySelectorAll('.DocField').forEach(docField => {
            docField.querySelectorAll('input, textarea, select').forEach(input => {
                const include = props.data.ids.includes(input.id)
                if (input.type == 'number' && include) {
                    inputs.push({
                        ...callField,
                        value: input.value
                    })
                    if (totalLabel === null) {
                        totalLabel = docField.parentElement.parentElement
                            .querySelector('.total-label')
                    }
                }
            })
        })

        totalLabel.innerText = `Сумма: ${getTotal(inputs)}`
    }, [props])

    useEffect(() => {
        updateItemTotal()
    }, [props])

    return (
        <Fade in={true} timeout={700}>
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
                                props.is_editable,
                                (callField) => {
                                    updateItemTotal(callField)
                                    dispatch(changeMoneyTotal(true))
                                }
                            )
                        }
                    </Stack>
                    <Typography variant="subtitle2" color="primary"
                        padding="5px 20px"
                        fontSize="0.85em" bgcolor={theme.palette.secondary.main}
                        borderRadius="10px 0 10px 0"
                        className="total-label"
                        marginLeft="auto!important">
                    </Typography>
                </Stack>
            </Stack>
        </Fade>
    )
}
