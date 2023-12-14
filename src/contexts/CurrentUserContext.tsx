import React, {
	FC,
	MutableRefObject,
	PropsWithChildren,
	createContext,
	useCallback,
	useMemo,
	useReducer,
	useRef,
} from 'react';
import axios, { AxiosResponse } from 'axios';
import ErrorBoundary from '../ErrorBoundary';
import { useNavigate } from 'react-router';
import { signinDataType } from '../auth/SignInForm';

export type UserContextType = {
	pk: number;
	username: string;
	email: string;
	name: string;
	content: string;
	profile_id: number;
	profile_image: string;
} | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isUserContextType(obj: any): obj is UserContextType {
	return (
		obj &&
		typeof obj.pk === 'number' &&
		typeof obj.username === 'string' &&
		typeof obj.email === 'string' &&
		typeof obj.first_name === 'string' &&
		typeof obj.last_name === 'string' &&
		typeof obj.profile_id === 'number' &&
		typeof obj.profile_image === 'string'
	);
}

type Action =
	| { type: 'LOG_IN'; payload: { user: UserContextType } }
	| { type: 'LOG_OUT' }
	| { type: 'EDIT_USERNAME'; payload: { username: string }}
	| { type: 'UPDATE_PROFILE'; payload: { name: string, content: string, profile_image: string}}

const initialRefreshKey = localStorage.getItem('refresh') || '';

const initialCurrentUser: UserContextType = null;

export type AuthAxiosPropsType = {
		method?: 'get' | 'post' | 'put' | 'delete',
		path: string,
		body?: object | null,
		multipart?: boolean
	}

export const CurrentUserContext =
	createContext<UserContextType>(initialCurrentUser);
export const FetchTokensContext = createContext<
	(signinData: signinDataType) => void
>(() => null);
export const AuthAxiosContext = createContext<
(props: AuthAxiosPropsType) => Promise<AxiosResponse<object> | null>
>(() => Promise.resolve({} as AxiosResponse));
// export const AuthenticatedFetchContext = createContext<
// 	(path: string) => Promise<AxiosResponse<object> | null>
// >(() => Promise.resolve({} as AxiosResponse));
// export const AuthenticatedPostContext = createContext<
// 	(path: string, body: object) => Promise<AxiosResponse<PostResponseData> | null>
// >(() => Promise.resolve({} as AxiosResponse));
// export const AuthenticatedPutContext = createContext<
// 	(path: string, body: object) => Promise<AxiosResponse<object> | null>
// >(() => Promise.resolve({} as AxiosResponse));
// export const AuthenticatedDeleteContext = createContext<
// 	(path: string) => Promise<AxiosResponse<object> | null>
// >(() => Promise.resolve({} as AxiosResponse));
// export const AuthenticatedMultipartPostContext = createContext<
// 	(path: string, body: object) => Promise<AxiosResponse<PostResponseData> | null>
// >(() => Promise.resolve({} as AxiosResponse));
// export const AuthenticatedMultipartPutContext = createContext<
// 	(path: string, body: object) => Promise<AxiosResponse<PostResponseData> | null>
// >(() => Promise.resolve({} as AxiosResponse));
export const SetCurrentUserContext = createContext<React.Dispatch<Action>>(
	() => {}
);

function currentUserReducer(
	state: UserContextType,
	action: Action
): UserContextType {
	switch (action.type) {
		case 'LOG_IN':
			return action.payload.user;
		case 'LOG_OUT':
			return null;
		case 'EDIT_USERNAME':
			if (state) {
				return {
					...state,
					username: action.payload.username,
				}
			} else {
				return state
			}
		case 'UPDATE_PROFILE':
			if (state) {
				return {
					...state,
					name: action.payload.name,
					content: action.payload.content,
					profile_image: action.payload.content
				}
			} else {
				return state
			}
		default:
			return state;
	}
}

export const CurrentUserProvider: FC<PropsWithChildren> = ({
	children,
}) => {
	console.log('CurrentUserProvider runs');
	const [currentUser, dispatch] = useReducer(
		currentUserReducer,
		initialCurrentUser
	);
	const refreshKey = useRef<string>(initialRefreshKey);
	const RefreshKeyContext = createContext<MutableRefObject<string>>(refreshKey);

	const navigate = useNavigate();

	// const authenticatedFetch = useCallback(
	// 	async (path: string): Promise<AxiosResponse<object> | null> => {
	// 		try {
	// 			const accessKeyData = await axios.post('api/token/refresh/', {
	// 				refresh: refreshKey.current,
	// 			});
	// 			if (accessKeyData.status === 200) {
	// 				try {
	// 					const response = await axios.get(path, {
	// 						headers: {
	// 							Authorization: `Bearer ${accessKeyData.data.access}`,
	// 						},
	// 					});
	// 					return response;
	// 				} catch (err) {
	// 					console.error(err);
	// 					return null;
	// 				}
	// 			} else {
	// 				dispatch({ type: 'LOG_OUT' });
	// 				localStorage.removeItem('refresh');
	// 				console.log('refresh key has been cleared from everywhere!!');
	// 				navigate('signin');
	// 				return null;
	// 			}
	// 		} catch (err) {
	// 			dispatch({ type: 'LOG_OUT' });
	// 			localStorage.removeItem('refresh');
	// 			console.log('refresh key has been cleared from everywhere!!');
	// 			console.error(err);
	// 			// navigate('signin');
	// 			return null;
	// 		}
	// 	},
	// 	[navigate]
	// );

	// const authenticatedPost = async (
	// 	path: string,
	// 	body: object
	// ): Promise<AxiosResponse<PostResponseData> | null> => {
	// 	try {
	// 		const accessKeyData = await axios.post('api/token/refresh/', {
	// 			refresh: refreshKey.current,
	// 		});
	// 		if (accessKeyData.status === 200) {
	// 			try {
	// 				const response = await axios.post(path, body, {
	// 					headers: {
	// 						Authorization: `Bearer ${accessKeyData.data.access}`,
	// 					},
	// 				});
	// 				return response;
	// 			} catch (err) {
	// 				console.error(err);
	// 				return null;
	// 			}
	// 		} else {
	// 			dispatch({ type: 'LOG_OUT' });
	// 			localStorage.removeItem('refresh');
	// 			console.log('refresh key has been cleared from everywhere!!');
	// 			navigate('signin');
	// 			return null;
	// 		}
	// 	} catch (err) {
	// 		dispatch({ type: 'LOG_OUT' });
	// 		localStorage.removeItem('refresh');
	// 		console.log('refresh key has been cleared from everywhere!!');
	// 		console.error(err);
	// 		navigate('signin');
	// 		return null;
	// 	}
	// };

	const authAxios = useCallback(async ({method, path, body=null, multipart=false}: AuthAxiosPropsType): Promise<AxiosResponse<object> | null> => {
		try {
			const accessKeyData = await axios.post('api/token/refresh/', {
				refresh: refreshKey.current,
			});
			if (accessKeyData.status === 200) {
				const config: {
					headers: {
						Authorization: string;
						'Content-Type'?: string;
					}
				} = {
					headers: {
						Authorization: `Bearer ${accessKeyData.data.access}`,
					},
				};
				if (multipart) {
					config.headers['Content-Type'] = 'multipart/form-data'
				}
				switch (method) {
					case 'post':
						return axios.post(path, body, config);
					case 'put':
						return axios.put(path, body, config);
					case 'delete':
						return axios.delete(path, config);
					default:
						return axios.get(path, config);
				}
				
			} else {
				dispatch({ type: 'LOG_OUT' });
				localStorage.removeItem('refresh');
				console.log('refresh key has been cleared from everywhere!!');
				navigate('signin');
				return null;
			}
		} catch (err) {
			dispatch({ type: 'LOG_OUT' });
			localStorage.removeItem('refresh');
			console.log('refresh key has been cleared from everywhere!!');
			console.error(err);
			navigate('signin');
			return null;
		}
	},[navigate]);

	// const authenticatedPut = async (
	// 	path: string,
	// 	body: object
	// ): Promise<AxiosResponse<PostResponseData> | null> => {
	// 	try {
	// 		const accessKeyData = await axios.post('api/token/refresh/', {
	// 			refresh: refreshKey.current,
	// 		});
	// 		if (accessKeyData.status === 200) {
	// 			try {
	// 				const response = await axios.put(path, body, {
	// 					headers: {
	// 						Authorization: `Bearer ${accessKeyData.data.access}`,
	// 					},
	// 				});
	// 				return response;
	// 			} catch (err) {
	// 				console.error(err);
	// 				return null;
	// 			}
	// 		} else {
	// 			dispatch({ type: 'LOG_OUT' });
	// 			localStorage.removeItem('refresh');
	// 			console.log('refresh key has been cleared from everywhere!!');
	// 			navigate('signin');
	// 			return null;
	// 		}
	// 	} catch (err) {
	// 		dispatch({ type: 'LOG_OUT' });
	// 		localStorage.removeItem('refresh');
	// 		console.log('refresh key has been cleared from everywhere!!');
	// 		console.error(err);
	// 		navigate('signin');
	// 		return null;
	// 	}
	// };

	// const authenticatedDelete = async (
	// 	path: string
	// ): Promise<AxiosResponse<object> | null> => {
	// 	try {
	// 		const accessKeyData = await axios.post('api/token/refresh/', {
	// 			refresh: refreshKey.current,
	// 		});
	// 		if (accessKeyData.status === 200) {
	// 			try {
	// 				const response = await axios.delete(path, {
	// 					headers: {
	// 						Authorization: `Bearer ${accessKeyData.data.access}`,
	// 					},
	// 				});
	// 				return response;
	// 			} catch (err) {
	// 				console.error(err);
	// 				return null;
	// 			}
	// 		} else {
	// 			dispatch({ type: 'LOG_OUT' });
	// 			localStorage.removeItem('refresh');
	// 			console.log('refresh key has been cleared from everywhere!!');
	// 			navigate('signin');
	// 			return null;
	// 		}
	// 	} catch (err) {
	// 		dispatch({ type: 'LOG_OUT' });
	// 		localStorage.removeItem('refresh');
	// 		console.log('refresh key has been cleared from everywhere!!');
	// 		console.error(err);
	// 		navigate('signin');
	// 		return null;
	// 	}
	// };

	// const authenticatedMultipartPost = async (
	// 	path: string,
	// 	body: object
	// ): Promise<AxiosResponse<PostResponseData> | null> => {
	// 	try {
	// 		const accessKeyData = await axios.post('api/token/refresh/', {
	// 			refresh: refreshKey.current,
	// 		});
	// 		if (accessKeyData.status === 200) {
	// 			return axios.post(path, body, {
	// 				headers: {
	// 					'Content-Type': 'multipart/form-data',
	// 					Authorization: `Bearer ${accessKeyData.data.access}`,
	// 				},
	// 			});
	// 		} else {
	// 			dispatch({ type: 'LOG_OUT' });
	// 			localStorage.removeItem('refresh');
	// 			console.log('refresh key has been cleared from everywhere!!');
	// 			navigate('signin');
	// 			return null;
	// 		}
	// 	} catch (err) {
	// 		dispatch({ type: 'LOG_OUT' });
	// 		localStorage.removeItem('refresh');
	// 		console.log('refresh key has been cleared from everywhere!!');
	// 		console.error(err);
	// 		navigate('signin');
	// 		return null;
	// 	}
	// };
	
	// const authenticatedMultipartPut = async (
	// 	path: string,
	// 	body: object
	// ): Promise<AxiosResponse<PostResponseData> | null> => {
	// 	try {
	// 		const accessKeyData = await axios.post('api/token/refresh/', {
	// 			refresh: refreshKey.current,
	// 		});
	// 		if (accessKeyData.status === 200) {
	// 			return axios.put(path, body, {
	// 				headers: {
	// 					'Content-Type': 'multipart/form-data',
	// 					Authorization: `Bearer ${accessKeyData.data.access}`,
	// 				},
	// 			});
	// 		} else {
	// 			dispatch({ type: 'LOG_OUT' });
	// 			localStorage.removeItem('refresh');
	// 			console.log('refresh key has been cleared from everywhere!!');
	// 			navigate('signin');
	// 			return null;
	// 		}
	// 	} catch (err) {
	// 		dispatch({ type: 'LOG_OUT' });
	// 		localStorage.removeItem('refresh');
	// 		console.log('refresh key has been cleared from everywhere!!');
	// 		console.error(err);
	// 		navigate('signin');
	// 		return null;
	// 	}
	// };

	const fetchAndSetTokens = async (signinData: signinDataType) => {
		const signinTokens = await axios.post('api/token/', signinData);
		console.log('refreshKey before setting: ', refreshKey);
		refreshKey.current = signinTokens.data.refresh;
		console.log('refreshKey after setting: ', refreshKey.current);
		setUserWithRefreshKey();
		localStorage.setItem('refresh', signinTokens.data.refresh);
		console.log('refresh token set in localstorage', signinTokens.data.refresh);
	};

	const fetchUser = useCallback(async () => {
		try {
			const response: AxiosResponse<object> | null = await authAxios({ path:
				'dj-rest-auth/user/'
		});
			if (response && response.data) {
				const user = response.data;
				console.log('successful fetchUser response: ', response);
				if (isUserContextType(user)) {
					return user;
				}
			}
			console.log('unsuccessful fetchUser response: ', response);
			return null;
		} catch (err) {
			console.log('fetchUser error: ', err);
			return null;
		}
	}, [authAxios]);

	const setUserWithRefreshKey = useCallback(() => {
		console.log('setting user with refresh key function runs');
		fetchUser().then((user) => {
			if (user) {
				console.log('newUser: ', user);
				dispatch({
					type: 'LOG_IN',
					payload: { user },
				});
			}
		});
	}, [fetchUser]);

	useMemo(() => {
		if (refreshKey) {
			setUserWithRefreshKey();
		}
	}, [setUserWithRefreshKey]);

	return (
		<ErrorBoundary>
			<CurrentUserContext.Provider value={currentUser}>
				<RefreshKeyContext.Provider value={refreshKey}>
					<FetchTokensContext.Provider value={fetchAndSetTokens}>
						<AuthAxiosContext.Provider value={authAxios}>
						{/* <AuthenticatedFetchContext.Provider value={authenticatedFetch}> */}
							{/* <AuthenticatedPostContext.Provider value={authenticatedPost}> */}
							{/* <AuthenticatedPutContext.Provider value={authenticatedPut}> */}
								{/* <AuthenticatedMultipartPostContext.Provider
									value={authenticatedMultipartPost}> */}
								{/* <AuthenticatedMultipartPutContext.Provider
									value={authenticatedMultipartPut}> */}
									{/* <AuthenticatedDeleteContext.Provider
										value={authenticatedDelete}> */}
										<SetCurrentUserContext.Provider value={dispatch}>
											{children}
										</SetCurrentUserContext.Provider>
									{/* </AuthenticatedDeleteContext.Provider> */}
								{/* </AuthenticatedMultipartPutContext.Provider> */}
								{/* </AuthenticatedMultipartPostContext.Provider> */}
							{/* </AuthenticatedPutContext.Provider> */}
							{/* </AuthenticatedPostContext.Provider> */}
						{/* </AuthenticatedFetchContext.Provider> */}
						</AuthAxiosContext.Provider>
					</FetchTokensContext.Provider>
				</RefreshKeyContext.Provider>
			</CurrentUserContext.Provider>
		</ErrorBoundary>
	);
};
