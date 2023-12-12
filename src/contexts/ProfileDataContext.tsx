import {
	FC,
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
    useState,
} from 'react';
import { PopularProfilesResponseType, ProfileDataType } from '../pages/profiles/ProfileTypes';
import { AuthenticatedFetchContext, CurrentUserContext } from './CurrentUserContext';


const initialProfileData: ProfileDataType = {
	// we will use the pageProfile later!
	pageProfile: {},
	popularProfiles: {
		count: 0,
		next: '',
		previous: '',
		results: [],
	},
};


export const ProfileDataContext =
	createContext<ProfileDataType>(initialProfileData);


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
							popularProfiles: response.data as PopularProfilesResponseType,
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
            {children}							
        </ProfileDataContext.Provider>

	);
};
