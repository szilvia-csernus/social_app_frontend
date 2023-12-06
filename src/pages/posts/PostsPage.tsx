import { useContext, type FC, useState, useEffect } from 'react';

// import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
// import Container from 'react-bootstrap/Container';

// import classes from './Post.module.css';
// import { axiosRes } from '../../api/axiosDefaults';
import { useLocation } from 'react-router-dom';
import {
	RefreshKeyContext,
} from '../../contexts/CurrentUserContext';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import PostDetail, { type PostType } from './PostDetail';
import axios from 'axios';
import { useCurrentUser } from '../../hooks/useCurrentUser';

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
	const currentUser = useCurrentUser();
	// const setAccessKey = useContext(SetAccessKeyContext);
	const refreshKey = useContext(RefreshKeyContext);
	const profile_id = currentUser?.profile_id || '';

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
		// if (currentUser) {
			let filter: string;
			if (currentUser) {

				switch (pathname) {
					case '/feed':
						filter = `owner__followed__owner__profile=${currentUser.profile_id}&`;
						break;
					case '/liked':
						filter = 
						`likes__owner__profile=${currentUser.profile_id}&ordering=-likes__created_at&`
						;
						break;
				}
			}
		// } else {
		// 	setFilter("");
		// }
	// }, [pathname, currentUser]);

	// console.log(pathname);
	// console.log('filter', filter);

	// useEffect(() => {
		// console.log('useEffect() for fetching posts in PostsPage runs');
		let postData;
		const fetchPosts = async () => {
			try {
				const accessKeyData = await axios.post('api/token/refresh/', {
					refresh: refreshKey,
				});
				if (accessKeyData.data.access) {
					// setAccessKey(accessKeyData.data.access);
					postData = await axios.get(`/posts/?${filter}`, {
						headers: {
							Authorization: `Bearer ${accessKeyData.data.access}`,
						},
					});
					setPosts(postData.data);
				} else {
					postData = await axios.get(`/posts/?${filter}`);
					setPosts(postData.data);
				}

				console.log('posts set to: ', postData.data);
				setHasLoaded(true);
			} catch (err) {
				console.log(err);
				// postData = await axiosRes.get('/posts/');
				// setPosts(postData.data);
				setHasLoaded(true);
			}
		};

		setHasLoaded(false);
		fetchPosts();
	}, [refreshKey, pathname, currentUser]);

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
