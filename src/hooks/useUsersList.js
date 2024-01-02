import React, { useState } from "react"
import UsersList from "../components/usersList/UsersList"

export default function useUsersList(isTask) {
    const [searchData, setSearchData] = useState('')

    return isTask ? function (styles, searchFieldId, getUsersData, closeCallback) {
        return <UsersList has_back={true}
            task_tool_styles={styles.task_tool_styles}
            text_field_styles={styles.text_field_styles}
            search_field_id={searchFieldId}
            close_callback={() => closeCallback()}
            search_callback={() => {
                setSearchData(
                    document.querySelector(`#${searchFieldId}`).value
                )
            }}
            users_data={getUsersData(searchData)} />
    }
        :
        function (styles, searchFieldId, getUsersData) {
            return <UsersList has_back={false}
                text_field_styles={styles.text_field_styles}
                search_field_id={searchFieldId}
                search_callback={() => {
                    setSearchData(
                        document.querySelector(`#${searchFieldId}`).value
                    )
                }}
                users_data={getUsersData(searchData)} />
        }
}