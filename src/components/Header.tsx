import { Link } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
// import myLogo from '../assets/logo.svg';

import classes from './Header.module.css';

function Header() {
	return (
		<Navbar expand="md" className="bg-body-tertiary">
			<Container>
				<Navbar.Brand>
					{/* <img
						src={myLogo}
						width="60"
						height="60"
						className="d-inline-block align-top"
						alt="connect logo"
					/> */}
					<Link to="/" className={classes.myNavLink}>
						<i id="logo" className="fa-solid fa-people-line"></i>
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<Link to="/sign-in" className={classes.myNavLink}>
							<i className="fa-solid fa-right-to-bracket"></i> Sign in
						</Link>
						<Link to="/register" className={classes.myNavLink}>
							<i className="fa-solid fa-circle-user"></i> Register
						</Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
