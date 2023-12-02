import classes from './Auth.module.css';
import btnClasses from '../components/Button.module.css'

import { Col, Row, Form, Button, Alert } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import illustration from '../assets/register.svg';

import { type ChangeEvent, useState, FormEvent } from 'react';
import axios, { AxiosError } from 'axios';
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

type registerDataType = {
	username: string,
	password1: string,
	password2: string
}

type errorDetail = string[]

type errorDataType = {
	username: errorDetail,
	password1: errorDetail,
	password2: errorDetail,
	non_field_errors: errorDetail
} | undefined

type ErrorResponse = {
	username?: string[],
	password1?: string[],
	password2?: string[],
	non_field_errors?: string[]
};


const RegisterForm = () => {
	const [registerData, setRegisterData] = useState<registerDataType>({
		username: '',
		password1: '',
		password2: ''
	})

	const [errors, setErrors] = useState<errorDataType>();

	const {username, password1, password2 } = registerData;

	// const navigate = useNavigate();

	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		const {name, value} = event.target;
		setRegisterData((prevData) => {
			return {
				...prevData,
				[name]: value,
			};
		});
	};

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault();

		try {
			await axios.post('dj-rest-auth/registration/', registerData, {
				headers: {
					"Content-Type": 'multipsrt/form-data',
				}
			});
			// navigate('login');
		} catch (error) {
			console.log(error)
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<ErrorResponse>;
				if (axiosError.response) {
					const { data } = axiosError.response;
					setErrors({
						username: data.username ? data.username : [],
						password1: data.password1 ? data.password1 : [],
						password2: data.password2 ? data.password2 : [],
						non_field_errors: data.non_field_errors ? data.non_field_errors : []
					});
				}
			}
		}
	};

	return (
		<Row className="py-5">
			<Col className="my-auto py-2 px-0" md={6}>
				<Card className={`p-4 ${classes.authCard}`}>
					<Card.Body>
						<div>
							<h1 className={`pb-3 ${classes.authHeader}`}>register</h1>
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
									name="password1"
									autoComplete="new-password"
									value={password1}
									onChange={handleChange}
								/>
							</Form.Group>
							{errors &&
								errors.password1.map((data, idx) => (
									<Alert variant="warning" key={idx}>
										{data}
									</Alert>
								))}

							<Form.Group className="mb-3" controlId="password2">
								<Form.Label className="d-none">Password (again)</Form.Label>
								<Form.Control
									className={classes.authInput}
									type="password"
									placeholder="Password (again)"
									name="password2"
									autoComplete="new-password"
									value={password2}
									onChange={handleChange}
								/>
							</Form.Group>

							{errors &&
								errors.password2.map((data, idx) => (
									<Alert variant="warning" key={idx}>
										{data}
									</Alert>
								))}

							<Button
								className={`${btnClasses.button} ${btnClasses.wide}`}
								type="submit"
							>
								Register
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
							<Link className={classes.authLink} to="/login">
								<span>Log in</span>
							</Link>
						</div>
					</Card.Body>
				</Card>
			</Col>
			<Col md={6} className="my-auto mx-auto d-none d-md-block">
				<img
					src={illustration}
					width="300"
					height="300"
					alt="register illustration"
				/>
			</Col>
		</Row>
	);
}

export default RegisterForm;
