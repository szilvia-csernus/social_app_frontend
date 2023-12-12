import {
	FC,
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
    useState,
} from 'react';
import { ProfileDataType, ProfilesResponseType } from '../pages/profiles/ProfileTypes';
import { AuthenticatedFetchContext, CurrentUserContext } from './CurrentUserContext';


const initialProfileData: ProfileDataType = {
	// we will use the pageProfile later!
	pageProfile: null,
	popularProfiles: {
		count: 0,
		next: '',
		previous: '',
		results: [],
	},
};


export const ProfileDataContext =
	createContext<ProfileDataType>(initialProfileData);

export const SetProfileDataContext = createContext<
	React.Dispatch<React.SetStateAction<ProfileDataType>>
>(() => {});



export const ProfileDataProvider: FC<PropsWithChildren> = ({children}) => {
	console.log('ProfileDataProvider runs');
	const [profileData, setProfileData] = useState<ProfileDataType>(initialProfileData);

		const authenticatedFetch = useContext(AuthenticatedFetchContext);
		const currentUser = useContext(CurrentUserContext);

		useEffect(() => {
			const handleMount = async () => {
				try {
					const response = await authenticatedFetch(
						'/profiles/?ordering=-followers_count'
					);
					console.log('popular profiles response: ', response);
					if (response && response.data) {
						setProfileData((prevState: ProfileDataType) => ({
							...prevState,
							popularProfiles: response.data as ProfilesResponseType,
						}));
					}
				} catch (err) {
					console.log(err);
				}
			};

			handleMount();
		}, [currentUser, authenticatedFetch]);

	return (
		<ProfileDataContext.Provider value={profileData}>
			<SetProfileDataContext.Provider value={setProfileData}>
				{children}
			</SetProfileDataContext.Provider>
		</ProfileDataContext.Provider>
	);
};
