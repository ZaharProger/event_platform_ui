import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded'
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded'
import GroupAddRoundedIcon from '@mui/icons-material/GroupAddRounded'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import InfoIcon from '@mui/icons-material/Info'
import DescriptionIcon from '@mui/icons-material/Description'
import PeopleIcon from '@mui/icons-material/People'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline'
import ShareRoundedIcon from '@mui/icons-material/ShareRounded'

import DeleteIcon from '@mui/icons-material/Delete'


export const toolTypes = {
    button: 0,
    checkbox: 1
}

export const createTool = {
    label: 'Создать',
    icon: AddCircleRoundedIcon,
    type: toolTypes.button
}

export const joinTool = {
    label: 'Присоединиться',
    icon: GroupAddRoundedIcon,
    type: toolTypes.button
}

export const showCompletedEventsTool = {
    label: 'Показывать только завершенные',
    icon: null,
    type: toolTypes.checkbox
}

export const profileTool = {
    label: 'Профиль',
    icon: AccountCircleRoundedIcon,
    type: toolTypes.button
}

export const backTool = {
    label: 'Назад',
    icon: ArrowBackIcon,
    type: toolTypes.button
}

export const mainTool = {
    label: 'Основное',
    icon: InfoIcon,
    type: toolTypes.button
}

export const docsTool = {
    label: 'Документы',
    icon: DescriptionIcon,
    type: toolTypes.button
}

export const participantsTool = {
    label: 'Участники',
    icon: PeopleIcon,
    type: toolTypes.button
}

export const completeTool = {
    label: 'Завершить',
    icon: CheckCircleIcon,
    type: toolTypes.button
}

export const leaderIdButton = {
    label: 'Leader ID',
    icon: ShareRoundedIcon,
    type: toolTypes.button
}

export const downloadButton = {
    label: 'Выгрузить',
    icon: DownloadForOfflineIcon,
    type: toolTypes.button
}

export const deleteTool = {
    label: 'Удалить',
    icon: DeleteIcon,
    type: toolTypes.button
}