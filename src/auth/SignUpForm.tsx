import { Link } from 'react-router-dom';

import classes from './Auth.module.css';

import { Col, Row} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import illustration from '../assets/register.svg'

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
				<Card className ={classes.authCard}>
					<Card.Body>
						<div>
							<h1 className={classes.authHeader}>register</h1>

						</div>
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
