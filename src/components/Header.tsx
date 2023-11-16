import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import myLogo from '../assets/logo.svg';

function Header() {
	return (
		<Navbar expand="md" className="bg-body-tertiary">
			<Container>
				<Navbar.Brand>
					<img
						src={myLogo}
						width="60"
						height="60"
						className="d-inline-block align-top"
						alt="connect logo"
					/>
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="basic-navbar-nav" />
				<Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
					<Nav>
						<Nav.Link>
							<i className="fa-solid fa-house-chimney"></i> Home
						</Nav.Link>
						<Nav.Link>
							<i className="fa-solid fa-right-to-bracket"></i> Sign in
						</Nav.Link>
						<Nav.Link>
							<i className="fa-solid fa-circle-user"></i> Register
						</Nav.Link>
					</Nav>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default Header;
