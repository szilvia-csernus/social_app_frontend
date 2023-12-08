import React, { FC, MutableRefObject, ReactNode, createContext, useCallback, useMemo, useReducer, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import ErrorBoundary from '../ErrorBoundary';
// import { redirect } from 'react-router-dom';

export type UserContextType = {
	pk: number;
	username: string;
	email: string;
	first_name: string;
	last_name: string;
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

type CurrentUserProviderProps = {
	children: ReactNode;
};

type Action =
	| {type: 'LOG_IN'; payload: {user: UserContextType};}
	| {type: 'LOG_OUT' }

const initialRefreshKey = localStorage.getItem('refresh') || '';

const initialCurrentUser: UserContextType = null;

type PostResponseData = {
	id: number;
}

export const CurrentUserContext = createContext<UserContextType>(initialCurrentUser);
export const RefreshKeyContext = createContext<MutableRefObject<string> | null>(null);
export const SetUserWithRefreshKeyContext = createContext<() => void>(() => {});
export const AuthenticatedFetchContext = createContext<
	(path: string) => Promise<AxiosResponse<object> | null>
>(() => Promise.resolve({} as AxiosResponse));
export const AuthenticatedPostContext = createContext<
	(path: string, body: object) => Promise<AxiosResponse<PostResponseData> | null>
>(() => Promise.resolve({} as AxiosResponse));
export const AuthenticatedDeleteContext = createContext<
	(path: string) => Promise<AxiosResponse<object> | null>
>(() => Promise.resolve({} as AxiosResponse));
export const LogoutUserContext = createContext<React.Dispatch<Action>>(() => {});

function currentUserReducer(
	state: UserContextType,
	action: Action
): UserContextType {
	switch (action.type) {
		case 'LOG_IN':
			return action.payload.user;
		case 'LOG_OUT':
			return null;
		default:
			return state;
	}
}


export const CurrentUserProvider: FC<CurrentUserProviderProps> = ({
	children,
}) => {
	console.log('CurrentUserProvider runs');
	const [currentUser, dispatch] = useReducer(
		currentUserReducer,
		initialCurrentUser
	);
	const refreshKey = useRef<string>(initialRefreshKey);

	const authenticatedFetch = async (
		path: string
	): Promise<AxiosResponse<object> | null> => {
		try {
			const accessKeyData = await axios.post('api/token/refresh/', {
				refresh: refreshKey.current,
			});
			if (accessKeyData.status === 200) {
				try {
					const response = await axios.get(path, {
						headers: {
							Authorization: `Bearer ${accessKeyData.data.access}`,
						},
					});
					return response;
				} catch (err) {
					console.error(err);
					return null;
				}
			} else {
				return null;
			}
		} catch (err) {
			console.error(err);
			return null;
		}
	};

	const authenticatedPost = async (
		path: string, body: object
	): Promise<AxiosResponse<PostResponseData> | null> => {
		try {
			const accessKeyData = await axios.post('api/token/refresh/', {
				refresh: refreshKey.current,
			});
			if (accessKeyData.status === 200) {
				try {
					const response = await axios.post(path, body, {
						headers: {
							Authorization: `Bearer ${accessKeyData.data.access}`,
						},
					});
					return response;
				} catch (err) {
					console.error(err);
					return null;
				}
			} else {
				return null;
			}
		} catch (err) {
			console.error(err);
			return null;
		}
	};

	const authenticatedDelete = async (
		path: string,
	): Promise<AxiosResponse<object> | null> => {
		try {
			const accessKeyData = await axios.post('api/token/refresh/', {
				refresh: refreshKey.current,
			});
			if (accessKeyData.status === 200) {
				try {
					const response = await axios.delete(path, {
						headers: {
							Authorization: `Bearer ${accessKeyData.data.access}`,
						},
					});
					return response;
				} catch (err) {
					console.error(err);
					return null;
				}
			} else {
				return null;
			}
		} catch (err) {
			console.error(err);
			return null;
		}
	};

	const fetchUser = useCallback(async () => {
		try {
			const response: AxiosResponse<object> | null = await authenticatedFetch(
				'dj-rest-auth/user/'
			);
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
	}, []);

	const setUserWithRefreshKey = useCallback(() => {
		console.log('setting user with refresh key function runs')
		fetchUser().then((user) => {
			if (user) {
				console.log('newUser: ', user)
				dispatch({
					type: 'LOG_IN',
					payload: {user},
				});
			}
			
		});
	}, [fetchUser]);

	useMemo(() => {
		if (refreshKey) {
			setUserWithRefreshKey();
		}
	},[setUserWithRefreshKey])



	return (
		<ErrorBoundary>
			<CurrentUserContext.Provider value={currentUser}>
				<RefreshKeyContext.Provider value={refreshKey}>
					<AuthenticatedFetchContext.Provider value={authenticatedFetch}>
					<AuthenticatedPostContext.Provider value={authenticatedPost}>
					<AuthenticatedDeleteContext.Provider value={authenticatedDelete}>
						<LogoutUserContext.Provider value={dispatch}>
							<SetUserWithRefreshKeyContext.Provider
								value={setUserWithRefreshKey}
							>
								{children}
							</SetUserWithRefreshKeyContext.Provider>
						</LogoutUserContext.Provider>
					</AuthenticatedDeleteContext.Provider>
					</AuthenticatedPostContext.Provider>
					</AuthenticatedFetchContext.Provider>
				</RefreshKeyContext.Provider>
			</CurrentUserContext.Provider>
		</ErrorBoundary>
	);
};
