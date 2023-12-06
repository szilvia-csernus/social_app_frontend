import {
	Dispatch,
	FC,
	ReactNode,
	SetStateAction,
	createContext,
	useCallback,
	useEffect,
	useReducer,
	useState,
} from 'react';
import axios from 'axios';
// import { axiosRes } from '../api/axiosDefaults';
import ErrorBoundary from '../ErrorBoundary';
import { redirect } from 'react-router-dom';

export type UserContextType = {
	pk: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
	profile_id: number;
	profile_image: string;
} | null;

type CurrentUserProviderProps = {
	children: ReactNode;
};

type Action = { type: 'SET_REFRESH_KEY'; payload: string };

export const CurrentUserContext = createContext<UserContextType>(null);
export const SetCurrentUserContext = createContext<Dispatch<SetStateAction<UserContextType>>>(() => {});
// export const AccessKeyContext = createContext<string | null>(null);
// export const SetAccessKeyContext = createContext<
	// Dispatch<SetStateAction<string>>
// >(() => {});
export const RefreshKeyContext = createContext<string | null>(null);
export const RefreshKeyDispatchContext = createContext<Dispatch<Action>>(() => {});

function refreshKeyReducer(state: string, action: Action) {
	switch (action.type) {
		case 'SET_REFRESH_KEY':
			return action.payload;
		default:
			throw new Error();
	}
}
const initialRefreshKey = localStorage.getItem('refresh') || '';


export const CurrentUserProvider: FC<CurrentUserProviderProps> = ({
	children,
}) => {
	console.log('CurrentUserProvider runs');
	const [currentUser, setCurrentUser] = useState<UserContextType>(null);
	// const [accessKey, setAccessKey] = useState('');
	const [refreshKey, dispatch] = useReducer(
		refreshKeyReducer,
		initialRefreshKey
	);

	const fetchUser = useCallback(async () => {
		try {
			const accessKeyData = await axios.post('api/token/refresh/', {
				refresh: refreshKey,
			});
			if (accessKeyData.data.access) {
				const { data } = await axios.get('dj-rest-auth/user', {
					headers: {
						Authorization: `Bearer ${accessKeyData.data.access}`,
					},
				});
				setCurrentUser(data);
				console.log('user set to: ', data)
			} else {
				setCurrentUser(null);
				console.log('user set to null: ', currentUser)
			}

		} catch (err) {
			console.log(err);
			setCurrentUser(null);
			console.log('user set to null: ', currentUser);
		}
	}, [refreshKey]);

	useEffect(() => {
		fetchUser();
	}, [fetchUser])


	// const fetchCurrentUser = useCallback(async () => {
	// 	console.log('fetchCurrentUser runs');

	// 	// if (accessKey !== '') {
	// 		try {
	// 			const { data } = await axiosRes.get('dj-rest-auth/user', {
	// 				headers: {
	// 					Authorization: `Bearer ${accessKey}`,
	// 				},
	// 			});
	// 			setCurrentUser(data);
	// 			console.log(
	// 				'fetchCurrentUser function, Access Key VALID, setCurrentUser:',
	// 				data
	// 			);
	// 		} catch (err) {
	// 			console.log(
	// 				'fetchCurrentUser function, Access Key invalid, error:',
	// 				err
	// 			);
	// 			// if (currentUser) {  // there was a user previously logged in
	// 			// redirect('/login');
	// 			// }
	// 			setCurrentUser(null);
	// 			console.log('currentUser set to null!');
	// 		}
	// 	// } else {
	// 	// 	setCurrentUser(null);
	// 	// 	console.log('currentUser set to null!');
	// 	// }
	// }, []); // if I include 'currentUser, I'd initiate an infinite loop!

	// useEffect(() => {
	// 	console.log('useEffect in CurrentUserContext runs');
	// 	fetchCurrentUser();
	// }, [fetchCurrentUser]);

	// useMemo runs before the children get mounted. That allows the axios interceptor to deliver
	// the requested current user data.

	// useCallback(() => {
	// 	console.log('useCallback() for interceptors runs');

		// const axiosReqInterceptor = axiosReq.interceptors.request.use(
		// 	async (config) => {
		// 		try {
		// 			const { data } = await axios.post('api/token/refresh/', {
		// 				refresh: refreshKey,
		// 			});
		// 			// if ( data.access !== accessKey ) {
		// 			setAccessKey(data.access);
		// 			// }
		// 			console.log('Access Key refreshed!!');
		// 			localStorage.setItem('access', data.access);
		// 			console.log('access data set for localstorage', data);

		// 			// Add the new accessKey as a Bearer token in the Authorization header
		// 			config.headers.Authorization = `Bearer ${data.access}`;
		// 			console.log('config.headers.Aughorization set to: ', config.headers.Authorization)
		// 		} catch (err) {
		// 			// if (accessKey !== '') {
		// 			setAccessKey('');
		// 			// }

		// 			return config;
		// 		}
		// 		return config;
		// 	},
		// 	(err) => {
		// 		return Promise.reject(err);
		// 	}
		// );

	// 	const axiosResInterceptor = axiosRes.interceptors.response.use(
	// 		(response) => response,
	// 		async (err) => {
	// 			// if accessKey was invalid, the response would be 401, if there was no accessKey, 400
	// 			if (err.response?.status === 401 || err.response?.status === 400) {
	// 				try {
	// 					console.log('axiosRes interceptor makes a call to refresh token.');
	// 					const { data } = await axios.post('api/token/refresh/', {
	// 						refresh: refreshKey,
	// 					});
	// 					// if (data.access !== accessKey) {
	// 					// setAccessKey(data.access);
	// 					// }
	// 					// console.log('Access Key refreshed!!');
	// 					console.log('access data set during interception', data);
	// 				} catch (err) {
	// 					console.log('refreshing token unsuccessful!', err);
	// 				}
	// 				// here, we return an exios instance with an err.config to exit the interceptor
	// 				return axios(err.config);
	// 			}
	// 			// Here, we reject the promise to exit the interceptor
	// 			return Promise.reject(err);
	// 		}
	// 	);
	// 	return () => {
	// 		// axiosReq.interceptors.request.eject(axiosReqInterceptor);
	// 		axiosRes.interceptors.response.eject(axiosResInterceptor);
	// 	};
	// }, [refreshKey]);

	return (
		<ErrorBoundary>
			<CurrentUserContext.Provider value={currentUser}>
				<SetCurrentUserContext.Provider value={setCurrentUser}>
					{/* <AccessKeyContext.Provider value={accessKey}> */}
					{/* <SetAccessKeyContext.Provider value={setAccessKey}> */}
					<RefreshKeyContext.Provider value={refreshKey}>
						<RefreshKeyDispatchContext.Provider value={dispatch}>
							{children}
						</RefreshKeyDispatchContext.Provider>
					</RefreshKeyContext.Provider>
					{/* </SetAccessKeyContext.Provider> */}
					{/* </AccessKeyContext.Provider> */}
				</SetCurrentUserContext.Provider>
			</CurrentUserContext.Provider>
		</ErrorBoundary>
	);
};
