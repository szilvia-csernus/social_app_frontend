import React, { ChangeEvent, useRef, useState } from 'react';

import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

import Upload from '../../assets/upload.svg';

import classes from './PostCreateEditForm.module.css';
// import appStyles from '../../App.module.css';
import btnClasses from '../../components/Button.module.css';
import Asset from '../../components/Asset';
import { Image } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { axiosReq } from '../../api/axiosDefaults';

type PostData = {
	title: string;
	content: string;
	image: string;
};

interface AxiosError extends Error {
	response?: {
		status?: number;
		data?: string;
	};
}

function PostCreateForm() {
	const [errors, setErrors] = useState({});
	const [postData, setPostData] = useState<PostData>({
		title: '',
		content: '',
		image: '',
	});

	const { title, content, image } = postData;

	const imageInput = useRef<HTMLInputElement | null>(null);
	
	const location = useLocation();
	const navigate = useNavigate();

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		setPostData({
			...postData,
			[event.target.name]: event.target.value,
		});
	};

	const handleChangeImage = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files.length) {
			URL.revokeObjectURL(image);
			setPostData({
				...postData,
				image: URL.createObjectURL(event.target.files[0]),
			});
		}
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();
		const formData = new FormData();

		formData.append('title', title);
		formData.append('content', content);
		if (imageInput.current && imageInput.current.files) {
			formData.append('image', imageInput.current.files[0])
		}

		const accessKey = localStorage.getItem('access');

		try {
			const { data } = await axiosReq.post('/posts/', formData, {
				headers: {
					Authorization: `Bearer ${accessKey}`,
				},
			});
			navigate(`/posts/${data.id}`, { state: { from: location } });
		} catch (err) {
			const axiosError = err as AxiosError;
			if (axiosError.response && axiosError.response.status !== 401) {
				setErrors(axiosError.response.data || {});
			}
		}
	}

	const handleCancel = () => {
		const previousLocation = location.state?.from || '/';
		navigate(previousLocation);
	};

	const textFields = (
		<div className="text-center">
			<Form.Group className="">
				<Form.Label className="">Title</Form.Label>
				<Form.Control
					className={classes.title}
					type="text"
					name="title"
					value={title}
					onChange={handleChange}
				/>
			</Form.Group>
			<Form.Group className="">
				<Form.Label className="">Content</Form.Label>
				<Form.Control
					className={classes.content}
					as="textarea"
					name="content"
					rows={6}
					value={content}
					onChange={handleChange}
				/>
			</Form.Group>
			<Button className={`${btnClasses.button}`} onClick={handleCancel}>
				cancel
			</Button>
			<Button className={`${btnClasses.button}`} type="submit">
				create
			</Button>
		</div>
	);

	return (
		<Form onSubmit={handleSubmit}>
			<Row className="justify-content-between">
				<Col className="py-2 p-0" md={6} lg={8}>
					<Container
						className={`${classes.content} ${classes.container} d-flex flex-column justify-content-center`}
					>
						<Form.Group className="text-center">
							{image ? (
								<>
									<figure>
										<Image
											className={classes.image}
											src={image}
											rounded
										/>
									</figure>
									<div>
										<Form.Label
											className={btnClasses.button}
											htmlFor="image-upload"
										>
											Change the image
										</Form.Label>
									</div>
								</>
							) : (
								<Form.Label
									className="d-flex justify-content-center"
									htmlFor="image-upload"
								>
									<Asset
										spinner={false}
										src={Upload}
										message={'Click or tap to upload an image'}
									/>
								</Form.Label>
							)}
							<Form.Control
								type="file"
								id="image-upload"
								accept="image/*"
								onChange={handleChangeImage}
								ref={imageInput}
							/>
						</Form.Group>
						<div className="d-md-none">{textFields}</div>
					</Container>
				</Col>
				<Col md={5} lg={4} className="d-none d-md-block p-0 my-2">
					<Container className={classes.content}>{textFields}</Container>
				</Col>
			</Row>
		</Form>
	);
}

export default PostCreateForm;
