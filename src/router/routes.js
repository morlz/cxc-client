export default [{
		path: '/',
		component: () =>import ('layouts/default'),
		children: [
			{ path: '', component: () => import ('pages/index') },
			{ path: 'sheet/:id', component: () => import('pages/Sheet') },
			{ path: 'permissions', component: () => import('pages/Permissions') },
			{ path: 'groups', component: () => import('pages/GroupsSettings') },
			{ path: 'add', component: () => import ('pages/Add'), children: [
				{ path: 'sheet/:id', component: () => import ('pages/AddSheet') },
			] },
		]
	},

	{ // Always leave this as last one
		path: '*',
		component: () =>
			import ('pages/404')
	}
]
