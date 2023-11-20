import '../api/axiosDefaults';

import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import { Context, Dispatch, SetStateAction, createContext, useEffect, useState } from 'react';
import axios from 'axios';

export type UserContextType = { username: string } | null;

const initialUser: UserContextType = null;

export type SetCurrentUserContextType = Context<Dispatch<SetStateAction<null>>>;

export const CurrentUserContext = createContext<UserContextType>(initialUser);
export let SetCurrentUserContext = createContext<Dispatch<SetStateAction<null>>>(() => {});


function App() {
	const [currentUser, setCurrentUser] = useState(null)

	SetCurrentUserContext = createContext(setCurrentUser)

	const fetchCurrentUser = async () => {
		try {
			const { data } = await axios.get('dj-rest-auth/user')
			setCurrentUser(data)
		} catch(err) {
			console.log(err)
		}
	}

	useEffect(() => {
		fetchCurrentUser()
	}, [])

	return (
		<CurrentUserContext.Provider value={currentUser}>
			<SetCurrentUserContext.Provider value={fetchCurrentUser}>
				<Container>
					<Header />
					<Container>
						<Outlet />
					</Container>
				</Container>
			</SetCurrentUserContext.Provider>
		</CurrentUserContext.Provider>
	);
}

export default App;
