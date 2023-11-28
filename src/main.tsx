import ReactDOM from 'react-dom/client'
import App from './pages/App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom';
import ErrorPage from './pages/Error.tsx';
import RegisterForm from './auth/RegisterForm.tsx';
import LogInForm from './auth/LogInForm.tsx';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import React from 'react';
import PostCreateEditForm from './pages/posts/PostCreateEditForm.tsx';


const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{ path: 'login', element: <LogInForm /> },
			{ path: 'register', element: <RegisterForm /> },
			{ path: 'posts/create', element: <PostCreateEditForm /> },
			{ path: 'liked', element: 'Liked elements' },
			{ path: 'feed', element: 'Feed' },
			{ path: 'profiles', element: 'Profiles page' },
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<CurrentUserProvider>
			<RouterProvider router={router} />
		</CurrentUserProvider>
	</React.StrictMode>
);
