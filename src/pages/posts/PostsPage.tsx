import { useContext, type FC, useState, useEffect } from 'react';

// import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
// import Container from 'react-bootstrap/Container';

// import styles from './Post.module.css';
// import { axiosRes } from '../../api/axiosDefaults';
import { useLocation, useNavigate } from 'react-router-dom';
import {
	CurrentUserStateContext,
} from '../../contexts/CurrentUserContext';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import PostDetail, { type PostType } from './PostDetail';
import axios from 'axios';

type PostsProps = {
	message: string;
};

export type PostsType = {
	count: number;
	next: string | null;
	previous: string | null;
	results: PostType[];
};

const PostsPage: FC<PostsProps> = ({ message }) => {
	const currentUserState = useContext(CurrentUserStateContext);

	const navigate = useNavigate();

	const [posts, setPosts] = useState<PostsType>({
		count: 0,
		next: null,
		previous: null,
		results: [],
	});
	const [hasLoaded, setHasLoaded] = useState(false);
	// const [filter, setFilter] = useState('');
	const { pathname } = useLocation();

	useEffect(() => {
		console.log('useEffect() for set filtering in PostPage runs');

		let filter: string;
		if (currentUserState && currentUserState.user) {
			console.log('currentUserState: ', currentUserState);
			console.log('pathname: ', pathname);
			switch (pathname) {
				case '/feed':
					filter = `owner__followed__owner__profile=${currentUserState.user.profile_id}&`;
					break;
				case '/liked':
					filter = `likes__owner__profile=${currentUserState.user.profile_id}&ordering=-likes__created_at&`;
					break;
			}
		} else {
			filter = '';
		}

		let postData;
		const fetchPosts = async () => {
			try {
				const accessKeyData = await axios.post('api/token/refresh/', {
					refresh: currentUserState.refresh,
				});
				if (accessKeyData.data.access && filter) {
					postData = await axios.get(`/posts/?${filter}`, {
						headers: {
							Authorization: `Bearer ${accessKeyData.data.access}`,
						},
					});
					setPosts(postData.data);
					console.log('posts set to: ', postData.data);
				} else {
					postData = await axios.get(`/posts/`);
					setPosts(postData.data);
					console.log('posts set to: ', postData.data);
				}

				setHasLoaded(true);
			} catch (err) {
				console.log(err);
				if (currentUserState.user) {
					navigate('/login')
				} else {
					postData = await axios.get(`/posts/`);
					setPosts(postData.data);
					console.log('posts set to: ', postData.data);
					setHasLoaded(true);
				}
				
			}
		};

		setHasLoaded(false);
		fetchPosts();
	}, [currentUserState, pathname, navigate]);

	return (
		<Row className="h-100">
			<Col className="py-2 p-0 p-lg-2" lg={8}>
				<p>Popular profiles mobile</p>
				{hasLoaded && (
					<>
						{posts.results.length ? (
							posts.results.map((post) => (
								<PostDetail
									key={post.id}
									{...post}
									setPosts={setPosts}
									postPage={false}
								/>
							))
						) : (
							<>
								{message}
								{console.log('show no results asset')}
							</>
						)}
					</>
				)}
				{!hasLoaded && (
					<Modal>
						<Spinner />
					</Modal>
				)}
			</Col>
			<Col md={4} className="d-none d-lg-block p-0 p-lg-2">
				<p>Popular profiles for desktop</p>
			</Col>
		</Row>
	);
};

export default PostsPage;
