import { Link, NavLink } from 'react-router-dom';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import myLogo from '../assets/logo.svg';

import classes from './Header.module.css';
import { ReactNode, useContext } from 'react';
import {
	CurrentUserStateContext,
	LogoutUserContext,
} from '../contexts/CurrentUserContext';
import Avatar from './Avatar';
import axios from 'axios';
import useClickOutsideToggle from '../hooks/useClickOutsideToggle';

function Header() {
	const currentUserState = useContext(CurrentUserStateContext);
	const dispatch = useContext(LogoutUserContext)

	const { expanded, setExpanded, ref } = useClickOutsideToggle();

	const HandleSignOut = async () => {
		const response = await axios.post('dj-rest-auth/logout/');
		if (response.status === 200) {
			dispatch({type: 'LOG_OUT'});
			localStorage.removeItem('refresh');
			console.log('refresh key has been cleared from everywhere!!')
			// redirect('/')
		} else {
			console.log('Logout unsuccessful', response);
		}
	};

	const loggedInIcons: ReactNode = (
		<>
			<NavLink to="/posts/create" className={classes.myNavLink}>
				<i className="far fa-plus-square"></i> Post
			</NavLink>
			<NavLink to="/feed" className={classes.myNavLink}>
				<i className="fas fa-stream"></i> Feed
			</NavLink>
			<NavLink to="/liked" className={classes.myNavLink}>
				<i className="fas fa-heart"></i> Liked
			</NavLink>
			<Link to="/" className={classes.myNavLink} onClick={HandleSignOut}>
				<i className="fas fa-sign-out-alt"></i> Logout
			</Link>
			<NavLink
				to={`/profiles/${currentUserState.user?.profile_id}`}
				className={classes.myNavLink}
			>
				{currentUserState.user && (
					<Avatar src={currentUserState.user.profile_image} text="" height={40} />
				)}
			</NavLink>
		</>
	);
	const loggedOutIcons = (
		<>
			<NavLink to="/login" className={classes.myNavLink}>
				<i className="fa-solid fa-right-to-bracket"></i> Log in
			</NavLink>
			<NavLink to="/register" className={classes.myNavLink}>
				<i className="fa-solid fa-circle-user"></i> Register
			</NavLink>
		</>
	);
	return (
		<Navbar expanded={expanded} expand="md" className="bg-body-tertiary">
			<Container>
				<Navbar.Brand>
					<Link to="/" className={classes.myNavLink}>
						<img
							src={myLogo}
							width="60"
							height="60"
							className="d-inline-block align-top"
							alt="connect logo"
						/>
					</Link>
				</Navbar.Brand>
				<Navbar.Toggle
					onClick={() => setExpanded(!expanded)}
					ref={ref}
					aria-controls="basic-navbar-nav"
				/>
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>{currentUserState.user ? loggedInIcons : loggedOutIcons}</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
