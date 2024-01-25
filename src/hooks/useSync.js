import { useSelector } from "react-redux"

export default function useSync() {
    const assignation = useSelector(state => state.assignation_list)

    return function (isRoadmap, actualData, currentData, excludeItemIds=[]) {
        let syncData

        if (isRoadmap) {
            const newData = actualData.map(actualItem => {
                const newItem = {
                    ...actualItem
                }

                let itemUsers = [...actualItem.users]
                const foundAssignation = assignation.filter(item => item.id == actualItem.id)

                if (foundAssignation.length != 0) {
                    if (foundAssignation[0].users !== itemUsers) {
                        itemUsers = foundAssignation[0].users
                    }
                }

                newItem.users = itemUsers

                return newItem
            })
            const newDataIds = newData.map(newItem => newItem.id)

            syncData = [
                ...currentData.filter(currentItem => {
                    let include = !newDataIds.includes(currentItem.id)
    
                    if (excludeItemIds.length != 0) {
                        const hasParent = isRoadmap ? 
                            excludeItemIds.includes(currentItem.parent) : false
                        include = include && !excludeItemIds.includes(currentItem.id) && !hasParent
                    }
    
                    return include
                }),
                ...newData
            ]
        }
        else {
            let fieldValuesIndex = -1
            for (let i = 0; i < actualData.length; ++i) {
                const fieldIndex = i % currentData.length
                if (fieldIndex == 0) {
                    ++fieldValuesIndex
                }

                if (currentData[fieldIndex].values[fieldValuesIndex] !== undefined) {
                    currentData[fieldIndex].values[fieldValuesIndex] = {
                        ...actualData[i]
                    }
                }
                else {
                    const include = !excludeItemIds.includes(
                        currentData[fieldIndex].values[fieldValuesIndex].id
                    )
                    if (include) {
                        currentData[fieldIndex].values.push({
                            ...actualData[i]
                        })
                    }
                    else {
                        currentData[fieldIndex].values[fieldValuesIndex].value = undefined
                    }
                }
            }
            syncData = currentData.map(currentItem => {
                return {
                    ...currentItem,
                    values: currentItem.values
                        .filter(value => value.value !== undefined)
                        .map(value => {
                            return {
                                ...value
                            }
                        })
                }
            })
        }

        return syncData
    }
}