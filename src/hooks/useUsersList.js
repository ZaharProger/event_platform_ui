import React, { useState } from "react"
import UsersList from "../components/usersList/UsersList"

import { v4 as uuidV4 } from "uuid"

export default function useUsersList(isTask, forModal=true) {
    const [searchData, setSearchData] = useState('')

    return isTask ? function (styles, searchFieldId, getUsersData, closeCallback, additionalButtons=[]) {
        return <UsersList has_back={true} key={`users_list_${uuidV4}`}
            task_tool_styles={styles.task_tool_styles}
            text_field_styles={styles.text_field_styles}
            search_field_id={searchFieldId}
            for_modal={forModal}
            additional_buttons={additionalButtons}
            close_callback={() => closeCallback()}
            search_callback={() => {
                setSearchData(
                    document.querySelector(`#${searchFieldId}`).value
                )
            }}
            users_data={getUsersData(searchData)} />
    }
        :
        function (styles, searchFieldId, getUsersData, additionalButtons=[]) {
            return <UsersList has_back={false} key={`users_list_${uuidV4}`}
                text_field_styles={styles.text_field_styles}
                search_field_id={searchFieldId}
                for_modal={forModal}
                additional_buttons={additionalButtons}
                search_callback={() => {
                    setSearchData(
                        document.querySelector(`#${searchFieldId}`).value
                    )
                }}
                users_data={getUsersData(searchData)} />
        }
}