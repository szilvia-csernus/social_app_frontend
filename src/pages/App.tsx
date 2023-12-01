import '../api/axiosDefaults';

import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function App() {
	

	return (
		<Container>
			<Header />
			<Container>
				<Outlet />
			</Container>
		</Container>
	);
}

export default App;
