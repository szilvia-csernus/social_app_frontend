import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import styles from './Post.module.css';
import { useParams } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
// import { axiosReq } from '../../api/axiosDefaults';
import PostDetail from './PostDetail';
import { PostType, PostsResponseType } from './PostTypes';
import axios from 'axios';

// type PostResults = {
//     results: PostResultType[]
// }

const PostPage: FC = () => {
	const { id } = useParams();
	const [posts, setPosts] = useState<PostsResponseType>({
		count: 0,
		next: '',
		previous: '',
		results: [],
	});

	useEffect(() => {
		const handleMount = async () => {
			try {
				// Promise.all() returns an array of resolved data
				const [{ data }] = await Promise.all([
					axios.get<PostType>(`/posts/${id}`),
				]);
				if (
					data
					// data.results &&
					// data.results[0]
				) {
					setPosts((prevState) => {
						return { ...prevState, results: [data] };
					});
					// setPost(data.results[0]);
				}
				console.log('post rendered by PostPage handleMount in useEffect', data);
			} catch (err) {
				console.log(err);
			}
		};

		handleMount();
	}, [id]); // if I add 'accessKey' to the dependency array, there'll be an infinite loop!!'

	return (
		<Row className="h-100">
			<Col className="py-2 p-0 p-lg-2" lg={8}>
				<p>Popular profiles for mobile</p>
				{/* postPage will evaluate as truthy inside this PostPage component! */}
				{<PostDetail {...posts.results[0]} setPosts={setPosts} postPage />}
				{/* {post && <PostDetail {...post} setPost={setPost} postPage/>} */}
				<Container className={styles.Content}>Comments</Container>
			</Col>
			<Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
				Popular profiles for desktop
			</Col>
		</Row>
	);
};

export default PostPage;
