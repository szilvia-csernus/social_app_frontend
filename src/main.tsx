import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from './routes/Root.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css'
import {
	createBrowserRouter,
	RouterProvider,
} from 'react-router-dom';
import ErrorPage from './routes/Error.tsx';
import SignUpForm from './auth/SignUpForm.tsx';


const router = createBrowserRouter([
	{
		path: '/',
		element: <Root />,
		errorElement: <ErrorPage />,
		children: [
			{ path: 'sign-in', element: <SignUpForm /> },
			{ path: 'register', element: <SignUpForm /> },
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
