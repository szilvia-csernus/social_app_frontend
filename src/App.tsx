import './App.css'

import { Container } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Header from './components/Header';

function App() {

  return (
		<Container>
      <Header />
			<Button variant="primary">Primary</Button>
		</Container>
	);
}

export default App
