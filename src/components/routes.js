export const routes = {
    home: '/',
    create_event: '/create/event',
    auth: '/auth',
    event_card: '/events/',
    event_card_docs: '/docs/',
    event_card_participants: '/participants',
    admin_group: '/admin/groups',
    admin_group_users: '/users',
    admin_group_docs: '/docs',
    create_doc: '/create/doc'
}

export const backendEndpoints = {
    users: '/users/',
    user_account: '/users/account/',
    user_groups: '/users/groups/',
    register: '/users/register/',
    auth: '/users/auth/',
    logout: '/users/logout/',
    events: '/events/',
    join_event: '/events/join',
    complete_event: '/events/complete',
    docs: '/docs/',
    templates: '/docs/templates/',
    settings: '/settings/',
    tasks: '/tasks/'
}

export const host = 'http://localhost:8000/api'