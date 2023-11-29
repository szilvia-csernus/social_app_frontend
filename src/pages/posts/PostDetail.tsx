import { useContext } from 'react';
import classes from './Post.module.css';
import { CurrentUserContext } from '../../contexts/CurrentUserContext';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { PostResultType } from './PostPage';


type PostDetailProps = {
	id: string;
	owner: string;
	profile_id: number;
	profile_image: string;
	comments_count: number;
	likes_count: number;
	like_id: number;
	title: string;
	content: string;
	image: string;
	updated_at: string;
	setPost: React.Dispatch<React.SetStateAction<PostResultType | null>>;
	postPage: boolean;
};

const PostDetail: React.FC<PostDetailProps> = ({
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
		setPost,
        postPage,
	}) => {

    const currentUser = useContext(CurrentUserContext);
    const is_owner = currentUser?.username === owner;

	return (
		<Card className={classes.post}>
			<Card.Body>
				<Card className="d-flex align-items-center justify-content-between">
					<Link to={`/profiles/${profile_id}`}>
						<Avatar src={profile_image} height={55} text="" />
						{owner}
					</Link>
					<div className="d-flex align-items-center">
						<span>{updated_at}</span>
						{is_owner && postPage && '...'}
					</div>
				</Card>
			</Card.Body>
			<Link to={`/posts${id}`}>
				<Card.Img src={image} alt={title} />
			</Link>
            <Card.Body>
                {title && <Card.Title className="text-center">{title}</Card.Title>}
                {content && <Card.Text>{content}</Card.Text>}
                <div className={classes.postBar}>
                    {is_owner ? (
                        <OverlayTrigger placement="top" overlay={<Tooltip>You can't like your own post!</Tooltip>}>
                            <i className="far fa-heart" />
                        </OverlayTrigger>
                    ) : like_id ? (
                        <span onClick={()=>{}}>
                            <i className={`fas fa-heart ${classes.heart}`} />
                        </span>
                    ) : currentUser ? (
                        <span onClick={() => {}}>
                            <i className={`far fa-heart ${classes.heartOutline}`} />
                        </span>
                    ) : (
                        <OverlayTrigger placement="top" overlay={<Tooltip>Log in to like posts!</Tooltip>}>
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
	);
};


export default PostDetail;
