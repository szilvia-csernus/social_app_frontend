import '../api/axiosDefaults';

import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';


function App() {
	

	return (
		<Container>
			<Header />
			<Container className="Main">
				<Outlet />
			</Container>
		</Container>
	);
}

export default App;
