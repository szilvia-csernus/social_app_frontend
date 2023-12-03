import {
	Dispatch,
	FC,
	MutableRefObject,
	ReactNode,
	SetStateAction,
	createContext,
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react';
import axios from 'axios';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
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

export const CurrentUserContext = createContext<UserContextType>(null);
export const AccessKeyContext = createContext<string | null>(null);
export const SetAccessKeyContext = createContext<Dispatch<SetStateAction<string>>>(() => {});
export const RefreshKeyContext = createContext<MutableRefObject<string> | null>(null);

type CurrentUserProviderProps = {
	children: ReactNode;
};

const storedAccessKey = localStorage.getItem('access') || '';
const storedRrefreshKey = localStorage.getItem('refresh') || '';

export const CurrentUserProvider: FC<CurrentUserProviderProps> = ({
	children,
}) => {
	console.log('CurrentUserProvider runs');
	const [currentUser, setCurrentUser] = useState(null);
	const [accessKey, setAccessKey] = useState(storedAccessKey);
	// refreshKey is stored in a ref. If it was stored in State, there would be an infinite loop 
	// within the useCallback() function for the interceptors because useCallback() clears the refreshKey 
	// if it was invalid causing it to re-run itself.
	const refreshKeyRef = useRef(storedRrefreshKey);

	const fetchCurrentUser = useCallback(async () => {
		console.log('fetchCurrentUser runs');

		if (accessKey !== '') {
			try {
				const { data } = await axios.get('dj-rest-auth/user', {
					headers: {
						Authorization: `Bearer ${accessKey}`,
					},
				});
				setCurrentUser(data);
				console.log(
					'fetchCurrentUser function, Access Key VALID, setCurrentUser:',
					data
				);
			} catch (err) {
				console.log(
					'fetchCurrentUser function, Access Key invalid, error:',
					err
				);
				// if (currentUser) {  // there was a user previously logged in
				redirect('/login');
				// }
				setCurrentUser(null);
				console.log('currentUser set to null!');
			}
		} else {
			setCurrentUser(null);
			console.log('currentUser set to null!');
		}
	}, [accessKey]); // if I include 'currentUser, I'd initiate an infinite loop!

	useEffect(() => {
		console.log('useEffect runs');
		fetchCurrentUser();
	}, [fetchCurrentUser]);

	// useMemo runs before the children get mounted. That allows the axios interceptor to deliver
	// the requested current user data.

	useCallback(() => {
		console.log('useCallback for interceptors runs');

		axiosReq.interceptors.request.use(
			async (config) => {
				try {
					const { data } = await axios.post('api/token/refresh/', {
						refresh: refreshKeyRef.current,
					});
					// if ( data.access !== accessKey ) {
					setAccessKey(data.access);
					// }
					console.log('Access Key refreshed!!');
					localStorage.setItem('access', data.access);
					console.log('access data set for localstorage', data);

					// Add the new accessKey as a Bearer token in the Authorization header
					config.headers.Authorization = `Bearer ${data.access}`;
				} catch (err) {
					// if (accessKey !== '') {
					setAccessKey('');
					// }
					refreshKeyRef.current = '';
					return config;
				}
				return config;
			},
			(err) => {
				return Promise.reject(err);
			}
		);

		axiosRes.interceptors.response.use(
			(response) => response,
			async (err) => {
				if (err.response?.status === 401) {
					try {
						const { data } = await axios.post('api/token/refresh/', {
							refresh: refreshKeyRef.current,
						});
						// if (data.access !== accessKey) {
						setAccessKey(data.access);
						// }
						console.log('Access Key refreshed!!');
						localStorage.setItem('access', data.access);
						console.log('access data set during interception', data);
					} catch (err) {
						console.log('refreshing token unsuccessful!', err);
					}
					// here, we return an exios instance with an err.config to exit the interceptor
					return axios(err.config);
				}
				// Here, we reject the promise to exit the interceptor
				return Promise.reject(err);
			}
		);
	}, [refreshKeyRef]);

	return (
		<ErrorBoundary>
			<CurrentUserContext.Provider value={currentUser}>
				<AccessKeyContext.Provider value={accessKey}>
					<SetAccessKeyContext.Provider value={setAccessKey}>
						<RefreshKeyContext.Provider value={refreshKeyRef}>
							{children}
						</RefreshKeyContext.Provider>
					</SetAccessKeyContext.Provider>
				</AccessKeyContext.Provider>
			</CurrentUserContext.Provider>
		</ErrorBoundary>
	);
};
