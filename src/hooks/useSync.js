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
                ...newData.filter(newItem => 
                    !excludeItemIds.includes(newItem.id) || excludeItemIds.length == 0)
            ]
        }
        else {
            const newData = currentData.map(currentItem => {
                return {
                    ...currentItem,
                    values: currentItem.values.map(value => {
                        return {
                            ...value
                        }
                    })
                }
            })
            let fieldValuesIndex = -1
  
            for (let i = 0; i < actualData.length; ++i) {
                const fieldIndex = i % newData.length
                if (fieldIndex == 0) {
                    ++fieldValuesIndex
                }

                if (newData[fieldIndex].values[fieldValuesIndex].value !== undefined) {
                    newData[fieldIndex].values[fieldValuesIndex] = {
                        ...actualData[i]
                    }
                }
                else {                   
                    const include = !excludeItemIds.includes(
                        newData[fieldIndex].values[fieldValuesIndex].id
                    )
                    if (include) {
                        newData[fieldIndex].values.push({
                            ...actualData[i]
                        })
                    }
                    else {
                        newData[fieldIndex].values[fieldValuesIndex].value = undefined
                    }
                }
            }
            syncData = newData.map(currentItem => {
                return {
                    ...currentItem,
                    values: currentItem.values
                        .filter(value => value.value !== undefined)
                }
            })
        }

        return syncData
    }
}