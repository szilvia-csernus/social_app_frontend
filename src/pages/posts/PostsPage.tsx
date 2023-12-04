import { useContext, type FC, useState, useMemo } from 'react';

// import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
// import Container from 'react-bootstrap/Container';

// import classes from './Post.module.css';
import { axiosReq } from '../../api/axiosDefaults';
import { useLocation} from 'react-router-dom';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import Modal from '../../components/Modal';
import Spinner from '../../components/Spinner';
import PostDetail, { type PostType } from './PostDetail';

type PostsProps = {
    message: string;
}

export type PostsType = {
	count: number;
	next: string | null;
	previous: string | null;
	results: PostType[]
}


const PostsPage: FC<PostsProps> = ({ message }) => {	
	const currentUser = useContext(CurrentUserContext);
	const profile_id = currentUser ?.profile_id || "";

	const [posts, setPosts] = useState<PostsType>({ count: 0, next: null, previous: null, results: [] });
	const [hasLoaded, setHasLoaded] = useState(false);
	const [filter, setFilter] = useState("");
	const { pathname } = useLocation();

	useMemo(() => {
		console.log('useMemo() for set filtering in PostPage runs')
		switch (pathname) {
			case '/feed':
				setFilter(`owner__followed__owner__profile=${profile_id}&`);
				break;
			case '/liked':
				setFilter(
					`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`
				);
				break;
		}
	}, [pathname, profile_id]);

	console.log(pathname)
	console.log("filter", filter);

	useMemo(() => {
		console.log('useMemo() for fetching posts in PostsPage runs')
		const fetchPosts = async () => {
			try {
				const { data } = await axiosReq.get(`/posts/?${filter}`);
				setPosts(data);
				console.log(data)
				setHasLoaded(true)
			} catch (err) {
				console.log(err)
			} 
		}

		setHasLoaded(false)
		fetchPosts()
	}, [filter])

    
	return (
		<Row className="h-100">
			<Col className="py-2 p-0 p-lg-2" lg={8}>
				<p>Popular profiles mobile</p>
				{hasLoaded ? (
					<>{posts.results.length
						? posts.results.map((post) => (
							<PostDetail key={post.id} {...post} setPosts={setPosts} postPage={false}/>
						))
						: 
						<>
						{ message }
						{console.log("show no results asset")}
						</>
						}
					</>
				) : (
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
}

export default PostsPage;
