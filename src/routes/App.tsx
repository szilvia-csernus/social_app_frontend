import '../api/axiosDefaults';

import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';


function Root() {
	return (
		<Container>
			<Header />
			<Container>
				<Outlet />
			</Container>
		</Container>
	);
}

export default Root;
