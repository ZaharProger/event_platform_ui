import { useSelector } from "react-redux"

export default function useSync() {
    const assignation = useSelector(state => state.assignation_list)

    return function (isRoadmap, actualData, currentData, excludeItemId=null) {
        let newData = []

        if (isRoadmap) {
            newData = actualData.map(actualItem => {
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
        }

        const newDataIds = newData.map(newItem => newItem.id)
        const syncData = [
            ...currentData.filter(currentItem => {
                let include = !newDataIds.includes(currentItem.id)

                if (excludeItemId !== null) {
                    const hasParent = isRoadmap ? excludeItemId === currentItem.parent : false
                    include = include && currentItem.id != excludeItemId && !hasParent
                }

                return include
            }),
            ...newData
        ]

        return syncData
    }
}