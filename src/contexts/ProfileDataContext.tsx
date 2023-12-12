import {
	FC,
	PropsWithChildren,
	createContext,
	useContext,
	useEffect,
    useState,
} from 'react';
import { ProfileDataType, ProfileType, ProfilesResponseType } from '../pages/profiles/ProfileTypes';
import { AuthenticatedFetchContext, AuthenticatedPostContext, AuthenticatedDeleteContext, CurrentUserContext } from './CurrentUserContext';
import { followHelper, unfollowHelper } from '../utils/utils';


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

type SetProfileDataProps = {
	setProfileData: React.Dispatch<React.SetStateAction<ProfileDataType>>;
	handleFollow: (clickedProfile: ProfileType) => Promise<void>;
	handleUnfollow: (clickedProfile: ProfileType) => Promise<void>;
};

export const SetProfileDataContext = createContext<SetProfileDataProps>({
	setProfileData: () => {},
	handleFollow: async () => {},
	handleUnfollow: async () => {}
});



export const ProfileDataProvider: FC<PropsWithChildren> = ({children}) => {
	console.log('ProfileDataProvider runs');
	const [profileData, setProfileData] = useState<ProfileDataType>(initialProfileData);

		const authenticatedFetch = useContext(AuthenticatedFetchContext);
		const currentUser = useContext(CurrentUserContext);
        const authenticatedPost = useContext(AuthenticatedPostContext);
        const authenticatedDelete = useContext(AuthenticatedDeleteContext);

        const handleFollow = async (clickedProfile: ProfileType) => {
            try {
                const response = await authenticatedPost('/follows/', {
                    followed_user: clickedProfile.id
                })
                if (response && response.data) {

                    setProfileData((prevState: ProfileDataType) => {
                        if (prevState.pageProfile) {
                            return {
                                ...prevState,
                                pageProfile:
                                    followHelper(prevState.pageProfile, clickedProfile, response.data.id),
                                popularProfiles: {
                                    ...prevState.popularProfiles,
                                    results: prevState.popularProfiles.results.map(profile =>
                                        followHelper(profile, clickedProfile, response.data.id))
                                }
                            }
                        } else {
                            return prevState;
                        }
                    })
                }
            } catch (err) {
                console.log(err)
            }
        }

        const handleUnfollow = async (clickedProfile: ProfileType) => {
					try {
						const response = await authenticatedDelete(
							`/follows/${clickedProfile.follow_id}/`
						);
						if (response && response.status === 204) {
							setProfileData((prevState: ProfileDataType) => {
								if (prevState.pageProfile) {
									return {
										...prevState,
										pageProfile: unfollowHelper(
											prevState.pageProfile,
											clickedProfile
										),
										popularProfiles: {
											...prevState.popularProfiles,
											results: prevState.popularProfiles.results.map(
												(profile) =>
													unfollowHelper(
														profile,
														clickedProfile
													),
											)
										},
									};
								} else {
									return prevState;
								}
							});
						}
					} catch (err) {
						console.log(err);
					}
				};

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
			<SetProfileDataContext.Provider value={{setProfileData, handleFollow, handleUnfollow}}>
				{children}
			</SetProfileDataContext.Provider>
		</ProfileDataContext.Provider>
	);
};
