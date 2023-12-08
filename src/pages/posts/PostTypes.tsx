export type PostType = {
	id: number;
	owner: string;
	profile_id: number;
	profile_image: string;
	comments_count: number;
	likes_count: number;
	like_id: number | null;
	title: string;
	content: string;
	image: string;
    is_owner: boolean;
    created_at: string;
	updated_at: string;
};


export type PostsResponseType = {
	count: number;
	next: string | null;
	previous: string | null;
	results: PostType[];
};

