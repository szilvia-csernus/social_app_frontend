import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import styles from './Post.module.css';
import { useParams } from 'react-router-dom';
import { FC, useContext, useEffect, useState } from 'react';
import PostDetail from './PostDetail';
import { PostType, PostsResponseType } from './PostTypes';
import Comment from '../comments/Comment';
import { CommentsResponseType, CommentsType } from '../comments/CommentTypes';
import CommentCreateForm from '../comments/CommentCreateForm';
import {
	AuthenticatedFetchContext,
	CurrentUserContext,
} from '../../contexts/CurrentUserContext';

const PostPage: FC = () => {
	const { id } = useParams();
	// In order to allow PostDetail page to handle & render the post's details coming from both
	// PostPage and Post[s]Page, we have to provide the post's type with the same blueprint.
	// Hence its 'posts' and not 'post'. The 'results' array on this page will have one
	// element only.
	const [posts, setPosts] = useState<PostsResponseType>({
		count: 0,
		next: '',
		previous: '',
		results: [],
	});
	const currentUser = useContext(CurrentUserContext);
	const [comments, setComments] = useState<CommentsResponseType>({
		count: 0,
		next: '',
		previous: '',
		results: [],
	});

	const authenticatedFetch = useContext(AuthenticatedFetchContext);

	useEffect(() => {
		const handleMount = async () => {
			try {
				// Promise.all() returns an array of resolved data
				const responses = await Promise.all([
					authenticatedFetch(`/posts/${id}`),
					authenticatedFetch(`/comments/?post=${id}`),
				]);
				if (responses && responses.length > 0 && responses[0]) {
					const postData = responses[0].data as PostType;

					setPosts((prevState) => {
						return { ...prevState, results: [postData] };
					});
					if (
						responses[1] &&
						responses[1].data &&
						'results' in responses[1].data
					) {
						const commentsData = responses[1].data.results as CommentsType;
						setComments((prevState) => {
							return { ...prevState, results: commentsData };
						});
					}
				}
				console.log(
					'post rendered by PostPage handleMount in useEffect',
					responses
				);
			} catch (err) {
				console.log(err);
			}
		};

		handleMount();
	}, [id, authenticatedFetch]);

	return (
		<>
			{id && (
				<Row className="h-100">
					<Col className="py-2 p-0 p-lg-2" lg={8}>
						<p>Popular profiles for mobile</p>
						{/* postPage will evaluate as truthy inside this PostPage component! */}
						{
							<PostDetail
								key={id}
								{...posts.results[0]}
								setPosts={setPosts}
								postPage
							/>
						}
						{/* {post && <PostDetail {...post} setPost={setPost} postPage/>} */}
						<Container className={styles.Content}>
							{currentUser ? (
								<CommentCreateForm
									profileId={currentUser.profile_id}
									profileImage={currentUser.profile_image}
									postId={id}
									setPosts={setPosts}
									setComments={setComments}
								/>
							) : comments.results.length > 0 ? (
								'Comments'
							) : null}
							{comments.results.length > 0 ? (
								comments.results.map((comment) => (
									<Comment
										key={comment.id}
										{...comment}
										setPosts={setPosts}
										setComments={setComments}
									/>
								))
							) : currentUser ? (
								<span>No comments yet, be the first to comment!</span>
							) : (
								<span>No comments... yet</span>
							)}
						</Container>
					</Col>
					<Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
						Popular profiles for desktop
					</Col>
				</Row>
			)}
		</>
	);
};

export default PostPage;
