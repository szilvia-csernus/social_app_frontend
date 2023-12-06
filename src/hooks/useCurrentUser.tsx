import { useContext } from 'react';
import { CurrentUserContext, UserContextType } from '../contexts/CurrentUserContext';

export function useCurrentUser() {
	const currentUser: UserContextType = useContext(CurrentUserContext);
	return currentUser;
}