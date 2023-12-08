import '../api/axiosDefaults';

import { Container } from 'react-bootstrap';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';
import { CurrentUserProvider } from '../contexts/CurrentUserContext';


function App() {
	

	return (
		<CurrentUserProvider>
			<Container>
				<Header />
				<Container className="Main">
					<Outlet />
				</Container>
			</Container>
		</CurrentUserProvider>
	);
}

export default App;
