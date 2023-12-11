import { useContext, useEffect, useState } from 'react'
import { Container} from 'react-bootstrap'
import { AuthenticatedFetchContext, CurrentUserContext } from '../../contexts/CurrentUserContext';
import { PopularProfilesResponseType, ProfileDataType } from './ProfileTypes';
import Asset from '../../components/Asset';

function PopularProfiles() {
    const [profileData, setProfileData] = useState<ProfileDataType>({
        // we will use the pageProfile later!
        pageProfile: {},
        popularProfiles: {
            count: 0,
            next: '',
            previous: '',
            results: []
        }
    });
    const { popularProfiles } = profileData;

    const authenticatedFetch = useContext(AuthenticatedFetchContext);
    const currentUser = useContext(CurrentUserContext);

    useEffect(() => {
        const handleMount = async () => {
            try {
                const response = await authenticatedFetch('/profiles/?ordering=-followers_count');
                console.log('popular profiles response: ', response)
                if (response && response.data) {
                    setProfileData((prevState: ProfileDataType) => ({
                        ...prevState,
                        popularProfiles: response.data as PopularProfilesResponseType
                    }));
                }
            } catch (err) {
                console.log(err)
            }
        };

        handleMount()
    }, [currentUser, authenticatedFetch])

  return (
		<Container className="Content">
			{popularProfiles.results.length > 0 ? (
				<>
					<p>Most followed profiles</p>
					{popularProfiles.results.map((profile) => (
						<p key={profile.id}>{profile.owner}</p>
					))}
				</>
			) : (
				<Asset spinner />
			)}
		</Container>
	);
}

export default PopularProfiles