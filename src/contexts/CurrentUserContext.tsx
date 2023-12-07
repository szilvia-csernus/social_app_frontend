import { FC, ReactNode, createContext, useReducer } from 'react';
import axios from 'axios';
// import { axiosRes } from '../api/axiosDefaults';
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

type UserReducerStateType = {
	user: UserContextType;
	refresh: string;
};

type CurrentUserProviderProps = {
	children: ReactNode;
};

type Action =
	| {type: 'LOG_IN'; payload: {user: UserContextType, refresh: string};}
	| { type: 'LOG_OUT' };

const initialRefreshKey = localStorage.getItem('refresh') || '';

const initialCurrentUserState: UserReducerStateType = {
	user: null,
	refresh: initialRefreshKey,
};

export const CurrentUserStateContext = createContext<UserReducerStateType>(initialCurrentUserState);
export const RefreshKeyContext = createContext<string | null>(null);
export const SetUserWithRefreshKeyContext = createContext<
	(refresh: string) => void
>(() => {});
export const LogoutUserContext = createContext<React.Dispatch<Action>>(() => {});

function currentUserReducer(
	state: UserReducerStateType,
	action: Action
): UserReducerStateType {
	switch (action.type) {
		case 'LOG_IN':
			return {
				user: action.payload.user,
				refresh: action.payload.refresh,
			};
		case 'LOG_OUT':
			return {
				user: null,
				refresh: '',
			}
		default:
			return state;
	}
}


async function fetchUser(refresh: string) {
	try {
		const accessKeyData = await axios.post('api/token/refresh/', {
			refresh: refresh,
		});
		if (accessKeyData.data.access) {
			const Userdata = await axios.get('dj-rest-auth/user', {
				headers: {
					Authorization: `Bearer ${accessKeyData.data.access}`,
				},
			});
			return Userdata.data;
		} else {
			return null;
		}
	} catch (err) {
		console.log(err);
		return null;
	}
}

export const CurrentUserProvider: FC<CurrentUserProviderProps> = ({
	children,
}) => {
	console.log('CurrentUserProvider runs');
	const [currentUser, dispatch] = useReducer(
		currentUserReducer,
		initialCurrentUserState
	);

	const setUserWithRefreshKey = (refresh: string) => {
		fetchUser(refresh).then((user: UserContextType) => {
			console.log('newUser: ', user)
			dispatch({
				type: 'LOG_IN',
				payload: { user, refresh: refresh },
			});
		});
	};

	return (
		<ErrorBoundary>
			<CurrentUserStateContext.Provider value={currentUser}>
				<RefreshKeyContext.Provider value={currentUser.refresh}>
					<LogoutUserContext.Provider value={dispatch}>
						<SetUserWithRefreshKeyContext.Provider
							value={setUserWithRefreshKey}
						>
							{children}
						</SetUserWithRefreshKeyContext.Provider>
					</LogoutUserContext.Provider>
				</RefreshKeyContext.Provider>
			</CurrentUserStateContext.Provider>
		</ErrorBoundary>
	);
};
