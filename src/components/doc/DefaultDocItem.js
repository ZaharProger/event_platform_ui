import { Fade, Stack } from '@mui/material'
import React from 'react'
import useSync from '../../hooks/useSync'
import useButton from '../../hooks/useButton'
import useFields from '../../hooks/useFields'
import useTextFieldStyles from '../../hooks/useTextFieldStyles'
import { deleteTool } from '../toolbar/tools'

export default function DefaultDocItem(props) {
    const getFields = useFields()
    const styles = useTextFieldStyles('outlined', props.is_editable)

    const getTool = useButton(true)
    const syncFunction = useSync()

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
            </Stack>
        </Fade>
    )
}
