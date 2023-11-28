import {
	Dispatch,
	ReactNode,
	SetStateAction,
	createContext,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from 'react';
import axios from 'axios';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import ErrorBoundary from '../ErrorBoundary';

export type UserContextType = {
	pk: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	profile_id: number;
	profile_image: string;
} | null;

export const CurrentUserContext = createContext<UserContextType>(null);
export const SetAccessKeyContext = createContext<Dispatch<SetStateAction<string>>>(() => {});
export const SetRefreshKeyContext = createContext<Dispatch<SetStateAction<string>>>(() => {});


type CurrentUserProviderProps = {
	children: ReactNode;
};

const storedAccessKey = localStorage.getItem('access') || '';
const storedRrefreshKey = localStorage.getItem('refresh') || '';

export const CurrentUserProvider = ({ children }: CurrentUserProviderProps) => {
	console.log('CurrentUserProvider runs')
	const [currentUser, setCurrentUser] = useState(null);
	const [accessKey, setAccessKey] = useState(storedAccessKey);
	const [refreshKey, setRefreshKey] = useState(storedRrefreshKey);

	const fetchCurrentUser = useCallback(async () => {
		console.log('fetchCurrentUser runs')
		
		if (accessKey !== '') {
			try {
				const { data } = await axiosRes.get('dj-rest-auth/user', {
					headers: {
						Authorization: `Bearer ${accessKey}`,
					},
				});
				setCurrentUser(data);
				console.log('fetchCurrentUser function, setCurrentUser:', data);
				
			} catch (err) {
				console.log('fetchCurrentUser function, Access Key invalid, error:', err);
				setCurrentUser(null)
				console.log('currentUser set to null!')
			}
		} else {
			setCurrentUser(null)
		}
	}, [accessKey]);
			

	useEffect(() => {
		console.log('useEffect runs')
		fetchCurrentUser();
	},[fetchCurrentUser]);

	// useMemo runs before the children get mounted. That allows the axios interceptor to deliver
	// the requested current user data.

	useMemo(() => {
		console.log('useMemo runs')

		axiosReq.interceptors.request.use(
			async (config) => {
				try {
					const { data } = await axios.post('api/token/refresh/', {
						refresh: refreshKey,
					});
					setAccessKey(data.access);
					localStorage.setItem('access', data.access);
					console.log('access data set for localstorage', data);
				} catch (err) {
					setCurrentUser(null);
					return config
				}
				return config
			},
			(err) => {
				return Promise.reject(err)
			}
		)
		axiosRes.interceptors.response.use(
			(response) => response,
			async (err) => {
				if (err.response?.status === 401) {
					try {
						const { data } = await axios.post('api/token/refresh/', {
							refresh: refreshKey,
						});
						setAccessKey(data.access);
						localStorage.setItem('access', data.access);
						console.log('access data set during interception', data);
					} catch (err) {
						console.log('refreshing token unsuccessful!', err)
					}
					// here, we return an exios instance with an err.config to exit the interceptor
					return axios(err.config)
				}
				// Here, we reject the promise to exit the interceptor
				return Promise.reject(err)
			}
		)
	}, [refreshKey])

    return (
			<ErrorBoundary>
				<CurrentUserContext.Provider value={currentUser}>
					<SetAccessKeyContext.Provider value={setAccessKey}>
						<SetRefreshKeyContext.Provider value={setRefreshKey}>
							{children}
						</SetRefreshKeyContext.Provider>
					</SetAccessKeyContext.Provider>
				</CurrentUserContext.Provider>
			</ErrorBoundary>
		);
};
