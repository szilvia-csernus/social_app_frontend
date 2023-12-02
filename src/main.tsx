import ReactDOM from 'react-dom/client';
import App from './pages/App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/Error.tsx';
import RegisterForm from './auth/RegisterForm.tsx';
import LogInForm from './auth/LogInForm.tsx';
import { CurrentUserProvider } from './contexts/CurrentUserContext';
import React from 'react';
import PostCreateEditForm from './pages/posts/PostCreateEditForm.tsx';
import PostPage from './pages/posts/PostPage.tsx';
import PostsPage from './pages/posts/PostsPage.tsx';
import Modal from './components/Modal.tsx';
import Spinner from './components/Spinner.tsx';

const router = createBrowserRouter([
	{
		path: '/',
		element: <App />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '',
				element: (
					<PostsPage message="No results found. Adjust the search keyword." />
				),
			},
			{
				path: 'feed',
				element: (
					<PostsPage message="No results found. Adjust the search keyword or follow a user." />
				),
			},
			{
				path: 'liked',
				element: (
					<PostsPage message="No results found. Adjust the search keyword or follow a user." />
				),
			},
			{ path: 'login', element: <LogInForm /> },
			{ path: 'register', element: <RegisterForm /> },
			{ path: 'posts/create', element: <PostCreateEditForm /> },
			{
				path: 'posts/:id',
				element: <PostPage />,
			},
			{ path: 'profiles', element: 'Profiles page' },
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<CurrentUserProvider>
			<RouterProvider
				router={router}
				fallbackElement={
					<Modal>
						<Spinner />
					</Modal>
				}
			/>
		</CurrentUserProvider>
	</React.StrictMode>
);
