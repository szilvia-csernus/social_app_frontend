import ReactDOM from 'react-dom/client'
import App from './routes/App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom';
import ErrorPage from './routes/Error.tsx';
import RegisterForm from './auth/RegisterForm.tsx';
import LogInForm from './auth/LogInForm.tsx';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import ErrorBoundary from './ErrorBoundary.tsx';


const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{ path: 'login', element: <LogInForm /> },
			{ path: 'register', element: <RegisterForm /> },
			{ path: 'posts', element: 'Posts' },
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<ErrorBoundary>
		<CurrentUserProvider>
			<RouterProvider router={router} />
		</CurrentUserProvider>
	</ErrorBoundary>
);
