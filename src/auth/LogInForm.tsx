import classes from './Auth.module.css';
import btnClasses from '../components/Button.module.css';

import { Col, Row, Form, Button, Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import illustration from '../assets/login.svg';

import { type ChangeEvent, useState, FormEvent, useContext } from 'react';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { SetAccessKeyContext } from '../contexts/CurrentUserContext';

type logInDataType = {
	username: string,
	password: string
};

type errorDetail = string[];

type errorDataType =
	{
        username: errorDetail,
        password: errorDetail,
		non_field_errors: errorDetail
	}
	| undefined;

type ErrorResponse = {
	username?: string[],
	password?: string[],
	non_field_errors?: string[]
};

const LogInForm = () => {
	const setAccessKey = useContext(SetAccessKeyContext);

	const [logInData, setLogInData] = useState<logInDataType>({
		username: '',
		password: ''
	});

	const [errors, setErrors] = useState<errorDataType>();

	const { username, password } = logInData;

	const navigate = useNavigate();

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setLogInData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		try {
			const loginData = await axios.post('dj-rest-auth/login/', logInData)
			if (loginData.status === 200) {
				const {data} = await axios.post('api/token/', logInData);
				setAccessKey(data.access);
				localStorage.setItem("access", data.access);
				localStorage.setItem("refresh", data.refresh);
				console.log("tokens set in localstorage", data)
				navigate('/posts');
			}
		} catch (error) {
			console.log(error);
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>;
				if (axiosError.response) {
					const { data } = axiosError.response;
					setErrors({
						username: data.username ? data.username : [],
						password: data.password ? data.password : [],
						non_field_errors: data.non_field_errors ? data.non_field_errors : []
					});
				}
			}
		}
	};

	return (
		<Row className="py-5">
			<Col md={6} className="my-auto d-none d-md-block p-2">
				<img
					src={illustration}
					width="300"
					height="300"
					alt="register illustration"
				/>
			</Col>
			<Col className="my-auto py-2 px-0" md={6}>
				<Card className={`p-4 ${classes.authCard}`}>
					<Card.Body>
						<div>
							<h1 className={`pb-3 ${classes.authHeader}`}>Log In</h1>
						</div>

						<Form onSubmit={handleSubmit}>
							<Form.Group className="mb-3" controlId="username">
								<Form.Label className="d-none">Username/email</Form.Label>
								<Form.Control
									className={classes.authInput}
									type="username"
									placeholder="Enter username"
									name="username"
									autoComplete="username"
									value={username}
									onChange={handleChange}
								/>
							</Form.Group>
							{errors &&
								errors.username.map((data, idx) => (
									<Alert variant="warning" key={idx}>
										{data}
									</Alert>
								))}

							<Form.Group className="mb-3" controlId="password1">
								<Form.Label className="d-none">Password</Form.Label>
								<Form.Control
									className={classes.authInput}
									type="password"
									placeholder="Password"
									name="password"
									autoComplete="password"
									value={password}
									onChange={handleChange}
								/>
							</Form.Group>
							{errors &&
								errors.password.map((data, idx) => (
									<Alert variant="warning" key={idx}>
										{data}
									</Alert>
								))}

							<Button
								className={`${btnClasses.button} ${btnClasses.wide}`}
								type="submit"
							>
								Log In
							</Button>
							{errors &&
								errors.non_field_errors.map((data, idx) => (
									<Alert variant="warning" key={idx}>
										{data}
									</Alert>
								))}
						</Form>
						<div>
							Already have an account?
							<Link className={classes.authLink} to="/register">
								<span>Register</span>
							</Link>
						</div>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
};

export default LogInForm;
