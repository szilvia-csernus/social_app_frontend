import { ChangeEvent, Dispatch, FormEvent, SetStateAction, useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

import styles from './CommentCreateEditForm.module.css';
import btnStyles from '../../components/Button.module.css';
import Avatar from '../../components/Avatar';
import { AuthenticatedPostContext, CurrentUserContext } from '../../contexts/CurrentUserContext';
import { PostsResponseType } from '../posts/PostTypes';



export type CommentType = {
    owner: number;
    content: string;
	post: number;
}

export type CommentsType = CommentType[]

export type CommentsResponseType = {
	count: number;
	next: string;
	previous: string;
	results: CommentsType;
};

type CommentPropsType = {
	post_id: string;
	setPosts: Dispatch<SetStateAction<PostsResponseType>>;
	setComments: Dispatch<SetStateAction<CommentsResponseType>>;
	profileImage: string;
	profile_id: number;
};

function CommentCreateForm(props: CommentPropsType) {
	const { post_id, setPosts, setComments, profileImage, profile_id } = props;
	const [content, setContent] = useState('');

	const currentUser = useContext(CurrentUserContext);

    const authenticatedPost = useContext(AuthenticatedPostContext);

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setContent(event.target.value);
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

        const formData = new FormData();

        formData.append('content', content);
		try {
			const response = await authenticatedPost('/comments/', {
				content,
				post: post_id
			});
            if (response && response.status === 200) {
                setComments((prevComments) => {
				return {
                    ...prevComments,
                    results: [
						{
						// comment submission was authenticated, hence we know there is a currentUser
						owner: currentUser!.profile_id, 
						content,
						post: Number(post_id),
						},
						...prevComments.results
					],
                }});
            } else {
                console.log('response was not in the requiered format', response);
            }
            console.log('fetching filtered posts response: ', response);
			
			setPosts((prevPosts) => ({
				...prevPosts,
				results: [
					{
						...prevPosts.results[0],
						comments_count: prevPosts.results[0].comments_count + 1,
					},
				],
			}));
			setContent('');
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<>
		{currentUser && 
		<Form className="mt-2" onSubmit={handleSubmit}>
			<Form.Group>
				<InputGroup>
					<Link to={`/profiles/${profile_id}`}>
						<Avatar src={profileImage} />
					</Link>
					<Form.Control
						className={styles.Form}
						placeholder="my comment..."
						as="textarea"
						value={content}
						onChange={handleChange}
						rows={2}
					/>
				</InputGroup>
			</Form.Group>
			<button
				className={`${btnStyles.Button} ${btnStyles.Blue} mt-4 btn d-block ml-auto`}
				disabled={!content.trim()}
				type="submit"
			>
				post
			</button>
		</Form>
		}
		</>
	);
}

export default CommentCreateForm;
