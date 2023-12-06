import { useContext } from 'react';
import classes from './Post.module.css';
import { Dispatch, SetStateAction, FC } from 'react';
import { RefreshKeyContext } from '../../contexts/CurrentUserContext';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { type PostsType } from './PostsPage';
import axios from 'axios';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export type PostType = {
	id: string;
	owner: string;
	profile_id: number;
	profile_image: string;
	comments_count: number;
	likes_count: number;
	like_id: number | null;
	title: string;
	content: string;
	image: string;
	updated_at: string;
};

export type PostDetailProps = PostType & {
	setPosts: Dispatch<SetStateAction<PostsType>>;
	postPage: boolean;
};

const PostDetail: FC<PostDetailProps> = ({
	id,
	owner,
	profile_id,
	profile_image,
	comments_count,
	likes_count,
	like_id,
	title,
	content,
	image,
	updated_at,
	setPosts,
	postPage,
}) => {
    
	const currentUser = useCurrentUser();
	const refreshKey = useContext(RefreshKeyContext);
	// const setAccessKey = useContext(SetAccessKeyContext)
	const isPostOwner = currentUser ? currentUser.username === owner : false;

	const handleLike = async () => {
		try {
			const accessKeyData = await axios.post('api/token/refresh/', {
				refresh: refreshKey,
			});
			// setAccessKey(accessKeyData.data.access);
			const { data } = await axios.post(
				'/likes/',
				{ post: id },
				{
					headers: {
						Authorization: `Bearer ${accessKeyData.data.access}`,
					},
				}
			);
			if (data !== null) {
				console.log('like response data', data);
				setPosts((prevPosts: PostsType) => {
					const indx = prevPosts.results.findIndex((post) => post.id === id);
					const updatedResults = [...prevPosts.results];
					console.log("prevPost", updatedResults[indx]);
					updatedResults[indx] = {
						...updatedResults[indx],
						likes_count: updatedResults[indx].likes_count + 1,
						like_id: data.id,
					};
					console.log("updated Post", updatedResults[indx])
					return {
						...prevPosts,
						results: updatedResults,
					};
				});
			}
		} catch (err) {
			console.log(err);
		}
	};

	const handleUnLike = async () => {
		try {
			const accessKeyData = await axios.post('api/token/refresh/', {
				refresh: refreshKey,
			});
			// setAccessKey(accessKeyData.data.access);
			await axios.delete(`/likes/${like_id}`, {
				headers: {
					Authorization: `Bearer ${accessKeyData.data.access}`,
				},
			});
			setPosts((prevPosts: PostsType) => {
				const indx = prevPosts.results.findIndex((post) => post.id === id);
				const updatedResults = [...prevPosts.results];
				console.log('prevPost', updatedResults[indx]);
				updatedResults[indx] = {
					...updatedResults[indx],
					likes_count: updatedResults[indx].likes_count - 1,
					like_id: null,
				};
				console.log('updated Post', updatedResults[indx]);
				return {
					...prevPosts,
					results: updatedResults,
				};
			});

		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
			<Card className={classes.post}>
				<Card.Body>
					<div className="d-flex align-items-center justify-content-between">
						<Link to={`/profiles/${profile_id}`} className="d-flex gap-2">
							<Avatar src={profile_image} height={55} text="" />
							{owner}
						</Link>
						<div className="d-flex align-items-center">
							<span>{updated_at}</span>
							{isPostOwner && postPage && '...'}
						</div>
					</div>
				</Card.Body>
				<Link to={`/posts${id}`}>
					<Card.Img src={image} alt={title} />
				</Link>
				<Card.Body>
					{title && (
						<Card.Title className="text-center">{title}</Card.Title>
					)}
					{content && <Card.Text>{content}</Card.Text>}
					<div
						className={`${classes.postBar} d-flex gap-2 justify-content-center`}
					>
						{isPostOwner ? (
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>You can't like your own post!</Tooltip>}
							>
								<i className="far fa-heart" />
							</OverlayTrigger>
						) : like_id ? (
							<span onClick={handleUnLike}>
								<i className={`fas fa-heart ${classes.heart}`} />
							</span>
						) : currentUser ? (
							<span onClick={handleLike}>
								<i className={`far fa-heart ${classes.heartOutline}`} />
							</span>
						) : (
							<OverlayTrigger
								placement="top"
								overlay={<Tooltip>Log in to like posts!</Tooltip>}
							>
								<i className="far fa-heart" />
							</OverlayTrigger>
						)}
						{likes_count}
						<Link to={`/posts/${id}`}>
							<i className="far fa-comments" />
						</Link>
						{comments_count}
					</div>
				</Card.Body>
			</Card>
		</>
	);
};

export default PostDetail;
