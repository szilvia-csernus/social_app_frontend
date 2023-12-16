import { rest } from "msw";

const baseURL = 'http://127.0.0.1:8000/';

export const handlers = [
	rest.get(`${baseURL}api/token/`, (req, res, ctx) => {
		return res(
			ctx.json({
				refresh:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoicmVmcmVzaCIsImV4cCI6MTcwMjgyOTQwNCwiaWF0IjoxNzAyNzQzMDA0LCJqdGkiOiI1Y2RkYzI2MWU4ODc0NmRhOTRiOTRhYzc5NzUzZGYyMSIsInVzZXJfaWQiOjR9.UvCJe8Oto_k4ahgLGTMSKY-7oKC4RdqWjLwH4nZl-Uk',
				access:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAyNzQzMDY0LCJpYXQiOjE3MDI3NDMwMDQsImp0aSI6IjY0NGMxZmVlYWJmODQ0MTRiN2UyODExYzg3ZWM3NDA2IiwidXNlcl9pZCI6NH0.qsh94PbnwNO-DyfOpYcYg8WnJioACMmT6J2JoHtGj3U',
			})
		);
	}),
	rest.get(`${baseURL}dj-rest-auth/user`, (req, res, ctx) => {
		return res(
			ctx.json({
				pk: 4,
				username: 'test2',
				email: 'test2@gmail.com',
				first_name: '',
				last_name: '',
				profile_id: 4,
				profile_image:
					'https://res.cloudinary.com/domjz4dz6/image/upload/v1/media/../default_profile_bq1aht',
			})
		);
	}),
	rest.get(`${baseURL}dj-rest-auth/login/`, (req, res, ctx) => {
		return res(
			ctx.json({
				key: '94e0ae0d74e4ea779399339589f209b2502ff841',
			})
		);
	}),
	rest.post(`${baseURL}api/token/refresh/`, (req, res, ctx) => {
		return res(
			ctx.json({
				access:
					'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzAyNzQzNjEyLCJpYXQiOjE3MDI3NDMzNTMsImp0aSI6ImQxOGVkMzAwNTU1ZjQ2MTE5ZjU4ODdkZGQ5M2VjNjQ0IiwidXNlcl9pZCI6NH0.cQNxfZm1689D1wxCsEcquEPJh58eyoyWZ3DQSbf6-yc',
			})
		);
	}),
	rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) => {
		return res(
			ctx.status(200))
		;
	}),
];