import { Card } from 'react-bootstrap';
import styles from './Comment.module.css';
import { Link } from 'react-router-dom';
import Avatar from '../../components/Avatar';
import { CommentType } from './CommentTypes';

function Comment({profile_id, profile_image, owner, updated_at, content}: CommentType) {
  return (
		<Card className={styles.Post}>
			<Card.Body>
				<div className="d-flex align-items-center justify-content-between">
					<Link to={`/profiles/${profile_id}`} className="d-flex gap-2">
						<Avatar src={profile_image} height={55} text="" />

						<div className="align-self-center ml-2">
							<div>
								<span className={styles.Owner}>{owner}</span>
								<span className={styles.Date}>{updated_at}</span>
							</div>
                            <p>
                                {content}
                            </p>
							{/* {isPostOwner && postPage && (
								<MoreDropdown
									handleEdit={handleEdit}
									handleDelete={handleDelete}
								/>
							)} */}
						</div>
					</Link>
				</div>
			</Card.Body>
		</Card>
	);
}

export default Comment