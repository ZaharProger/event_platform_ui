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
import HelpIcon from '@mui/icons-material/Help'
import DeleteIcon from '@mui/icons-material/Delete'
import SubdirectoryArrowRightIcon from '@mui/icons-material/SubdirectoryArrowRight'
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { routes } from '../routes'


export const toolTypes = {
    button: 0,
    checkbox: 1
}

export const createTool = {
    label: 'Создать',
    icon: AddCircleRoundedIcon,
    type: toolTypes.button,
    route: routes.create_event
}

export const addTool = {
    label: 'Добавить',
    icon: AddCircleRoundedIcon,
    type: toolTypes.button,
    route: null
}

export const viewTool = {
    label: 'Ознакомиться',
    icon: VisibilityIcon,
    type: toolTypes.button,
    route: null
}

export const joinTool = {
    label: 'Присоединиться',
    icon: GroupAddRoundedIcon,
    type: toolTypes.button,
    route: null
}

export const showCompletedEventsTool = {
    label: 'Показывать только завершенные',
    icon: null,
    type: toolTypes.checkbox,
    route: null
}

export const profileTool = {
    label: 'Профиль',
    icon: AccountCircleRoundedIcon,
    type: toolTypes.button,
    route: null
}

export const backTool = {
    label: 'Назад',
    icon: ArrowBackIcon,
    type: toolTypes.button,
    route: -1
}

export const mainTool = {
    label: 'Основное',
    icon: InfoIcon,
    type: toolTypes.button,
    route: null
}

export const docsTool = {
    label: 'Документы',
    icon: DescriptionIcon,
    type: toolTypes.button,
    route: null
}

export const participantsTool = {
    label: 'Участники',
    icon: PeopleIcon,
    type: toolTypes.button,
    route: null
}

export const completeTool = {
    label: 'Завершить',
    icon: CheckCircleIcon,
    type: toolTypes.button,
    route: null
}

export const publishTool = {
    label: 'Опубликовать',
    icon: ShareRoundedIcon,
    type: toolTypes.button,
    route: null
}

export const downloadTool = {
    label: 'Выгрузить архив',
    icon: DownloadForOfflineIcon,
    type: toolTypes.button,
    route: null
}

export const deleteTool = {
    label: 'Удалить',
    icon: DeleteIcon,
    type: toolTypes.button,
    route: null
}

export const helpTool = {
    label: 'Проблемы с входом?',
    icon: HelpIcon,
    type: toolTypes.button,
    route: null
}

export const addNestedTool = {
    label: 'Подзадачи',
    icon: SubdirectoryArrowRightIcon,
    type: toolTypes.button,
    route: null
}

export const assignTool = {
    label: 'Назначить',
    icon: AddCircleRoundedIcon,
    type: toolTypes.button,
    route: null
}

export const unpinTool = {
    label: 'Открепить',
    icon: RemoveCircleIcon,
    type: toolTypes.button,
    route: null
}
