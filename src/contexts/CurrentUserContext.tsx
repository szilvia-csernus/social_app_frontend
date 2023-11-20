import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useEffect,
	useState,
} from 'react';
import axios from 'axios';

export type UserContextType = { username: string } | null;
// export type SetCurrentUserContextType = Context<Dispatch<SetStateAction<null>>>;

export const CurrentUserContext = createContext<UserContextType>(null);

export let SetCurrentUserContext = createContext<Dispatch<SetStateAction<null>>>(() => {});

type CurrentUserProviderProps = {
	children: ReactNode;
};

export const CurrentUserProvider = ({ children }: CurrentUserProviderProps) => {
	const [currentUser, setCurrentUser] = useState(null);

	SetCurrentUserContext = createContext(setCurrentUser);

	const fetchCurrentUser = async () => {
		try {
			const { data } = await axios.get('dj-rest-auth/user');
			setCurrentUser(data);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		fetchCurrentUser();
	}, []);

    return (
			<CurrentUserContext.Provider value={currentUser} >
				<SetCurrentUserContext.Provider value={fetchCurrentUser}>
					{children}
				</SetCurrentUserContext.Provider>
			</CurrentUserContext.Provider>
		);
};
