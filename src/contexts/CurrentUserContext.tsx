import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useCallback,
	useEffect,
	// useMemo,
	useState,
} from 'react';
import axios from 'axios';
// import { axiosRes } from '../api/axiosDefaults';
// import { useNavigate } from 'react-router-dom';

export type UserContextType = {
	pk: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
} | null;

export const CurrentUserContext = createContext<UserContextType>(null);

export const SetAccessKeyContext = createContext<Dispatch<SetStateAction<string>>>(() => {});


type CurrentUserProviderProps = {
	children: ReactNode;
};

const storedAccessKey = localStorage.getItem('access');
const refreshKey = localStorage.getItem('refresh');

export const CurrentUserProvider = ({ children }: CurrentUserProviderProps) => {
	const [currentUser, setCurrentUser] = useState(null);
	const [accessKey, setAccessKey] = useState('');

	const fetchCurrentUser = useCallback(async () => {
		if (storedAccessKey) {
			setAccessKey(storedAccessKey);
		}
		const refreshAccessToken = async () => {
			try {
				const { data } = await axios.post('api/token/refresh/', {
					refresh: refreshKey,
				});
				setAccessKey(data.access);
				localStorage.setItem('access', data.access);
				console.log('access data set for localstorage', data);
			} catch (err) {
				console.log('removing tokens');
				localStorage.removeItem('access');
				localStorage.removeItem('refresh');
				console.log(err);
			}
		};
		if (accessKey !== '' &&  accessKey !== null) {
			try {
				const { data } = await axios.get('dj-rest-auth/user', {
					headers: {
						Authorization: `Bearer ${accessKey}`,
					},
				});
				setCurrentUser(data);
				console.log('fetchCurrentUser data', data);
				if (data.status === 401) {
					console.log('fetchCurrentUser refreshing token', data);
					refreshAccessToken();
				}
			} catch (err) {
				console.log('fetchCurrentUser error', err);
			}
		} else if (refreshKey) {
			console.log('fetchCurrentUser no accessKey but refreshKey');
			refreshAccessToken();
		} else return null;
	}, [accessKey]);
			

	useEffect(() => {
		fetchCurrentUser();
	},[fetchCurrentUser]);

	// useMemo runs before the children get mounted. That allows the axios interceptor to deliver
	// the requested current user data.

	// useMemo(() => {
	// 	axiosRes.interceptors.response.use(
	// 		(response) => response,
	// 		async (err) => {
	// 			if (err.response?.status === 401) {
	// 				try {
	// 					await axios.post('/dj-rest-auth/token/refresh/')
	// 				} catch (err) {
	// 					setCurrentUser(prevCurrentUser => {
	// 						if (prevCurrentUser) {
	// 							// navigate('login');
	// 						}
	// 						return null
	// 					})
	// 				}
	// 				return axios(err.config)
	// 			}
	// 			return Promise.reject(err)
	// 		}
	// 	)
	// }, [])

    return (
			<CurrentUserContext.Provider value={currentUser} >
				<SetAccessKeyContext.Provider value={setAccessKey}>
					{children}
				</SetAccessKeyContext.Provider>
			</CurrentUserContext.Provider>
		);
};
