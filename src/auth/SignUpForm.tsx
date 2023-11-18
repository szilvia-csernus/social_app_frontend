import classes from './Auth.module.css';
import btnClasses from '../components/Button.module.css'

import { Link } from 'react-router-dom';

import { Col, Row, Form, Button } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import illustration from '../assets/register.svg';

const SignUpForm = () => {
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
			<Col className="my-auto py-2 p-md-2" md={6}>
				<Card className={`p-4 ${classes.authCard}`}>
					<Card.Body>
						<div>
							<h1 className={`pb-3 ${classes.authHeader}`}>register</h1>
						</div>

						<Form>
							<Form.Group className="mb-3" controlId="email">
								<Form.Label className="d-none">Email address</Form.Label>
								<Form.Control
									className={classes.authInput}
									type="email"
									placeholder="Enter email"
									name="email"
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="password1">
								<Form.Label className="d-none">Password</Form.Label>
								<Form.Control
									className={classes.authInput}
									type="password"
									placeholder="Password"
									name="password1"
								/>
							</Form.Group>

							<Form.Group className="mb-3" controlId="password2">
								<Form.Label className="d-none">Password (again)</Form.Label>
								<Form.Control
									className={classes.authInput}
									type="password"
									placeholder="Password (again)"
									name="password2"
								/>
							</Form.Group>

							<Button
								className={`${btnClasses.button} ${btnClasses.wide}`}
								type="submit"
							>
								Register
							</Button>
						</Form>
						<div>
							Already have an account?
							<Link className={classes.authLink} to="/signin">
								<span>Sign in</span>
							</Link>
						</div>
					</Card.Body>
				</Card>
			</Col>
		</Row>
	);
};

export default SignUpForm;
