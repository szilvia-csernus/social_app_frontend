import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';

import classes from './PostCreateEditForm.module.css';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { axiosReq } from '../../api/axiosDefaults';
import Post from './Post';

type PostType = {
    results: string[]
}

const PostPage = () => {
	const { id } = useParams();
    const [post, setPost] = useState<PostType>({ results: []});

    useEffect(() => {
        const handleMount = async () => {
            try {
                const [{data: post}] = await Promise.all([
                    axiosReq.get(`/posts/${id}`),
                ])
                setPost({results: [post]})
                console.log(post)
            } catch(err) {
                console.log(err)
            }
        }

        handleMount();
    }, [id])

	return (
		<Row className="h-100">
			<Col className="py-2 p-0 p-lg-2" lg={8}>
				<p>Popular profiles for mobile</p>
                {/* postPage will evaluate as truthy */}
				<Post {...post.results[0]} setPost={setPost} postPage/> 
				<Container className={classes.content}>Comments</Container>
			</Col>
			<Col lg={4} className="d-none d-lg-block p-0 p-lg-2">
				Popular profiles for desktop
			</Col>
		</Row>
	);
}

export default PostPage;
