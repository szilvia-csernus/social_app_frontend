import ReactDOM from 'react-dom/client';
import App from './pages/App.tsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorPage from './pages/Error.tsx';
import SignUpForm from './auth/SignUpForm.tsx';
import SignInForm from './auth/SignInForm.tsx';
// import React from 'react';
import CreatePostForm from './pages/posts/CreatePostForm.tsx';
import PostPage from './pages/posts/PostPage.tsx';
import PostsPage from './pages/posts/PostsPage.tsx';
import Modal from './components/Modal.tsx';
import Spinner from './components/Spinner.tsx';
import EditPostForm from './pages/posts/EditPostForm.tsx';
import ProfilePage from './pages/profiles/ProfilePage.tsx';


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
					<PostsPage message="No results found. Adjust the search keyword or like a post." />
				),
			},
			{ path: 'signin', element: <SignInForm /> },
			{ path: 'signup', element: <SignUpForm /> },
			{ path: 'posts/create', element: <CreatePostForm /> },
			{
				path: 'posts/:id',
				element: <PostPage />,
			},
			{
				path: 'posts/:id/edit',
				element: <EditPostForm />,
			},
			{ path: 'profiles/:id', element: <ProfilePage />}
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	// <React.StrictMode>
		
			<RouterProvider
				router={router}
				fallbackElement={
					<Modal>
						<Spinner />
					</Modal>
				}
			/>
	// </React.StrictMode>
);
