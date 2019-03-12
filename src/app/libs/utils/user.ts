import eventbus from '../eventbus'

type User = {
	email: string
	token: string
}

export const user = (): User => {
	const userString: string = localStorage.getItem('user')

	if (!userString) {
		return
	}

	const user: User = JSON.parse(userString)

	return user
}
