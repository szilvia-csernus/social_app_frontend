import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { PostType, PostsResponseType } from "../pages/posts/PostTypes";
import { CommentType, CommentsResponseType } from "../pages/comments/CommentTypes";
import { ProfileType } from "../pages/profiles/ProfileTypes";

export type ResourceType = 
	| PostsResponseType | CommentsResponseType;

type ResultType = 
	| PostType | CommentType;


export const fetchMoreData = async <T extends ResourceType, R extends ResultType> (
	fetchFunction: (path: string) => Promise<AxiosResponse<object> | null>,
	resource: T,
	setResource: Dispatch<SetStateAction<T>>
) => {
	try {
		const response = await fetchFunction(resource.next);
		if (response) {
			const { data } = response;
			setResource((prevResource: T) => {
				const newData = data as T;
				const oldResults = prevResource.results as R[];
				const newResults = newData.results as R[];

				const mergedResults = newResults.reduce<R[]>((acc, cur) => {
					return acc.some((accResult) => accResult.id === cur.id)
						? acc
						: [...acc, cur];
				}, oldResults);

				return {
					...prevResource,
					next: newData.next,
					results: mergedResults,
				};
			});
		}
	} catch (err) {
		console.error(err);
	}
};

export const followHelper = (
	profile: ProfileType,
	clickedProfile: ProfileType,
	follow_id: number
) => {
	return {
			...profile,
			followers_count:
				profile.id === clickedProfile.id
					? profile.followers_count + 1
					: profile.followers_count,
			follow_id:
				profile.id === clickedProfile.id
					? follow_id
					: profile.follow_id,
			following_count: profile.is_owner
				? profile.following_count + 1
				: profile?.following_count,
		}
}

export const unfollowHelper = (
	profile: ProfileType,
	clickedProfile: ProfileType
) => {
	return {
		...profile,
		followers_count:
			profile.id === clickedProfile.id
				? profile.followers_count - 1
				: profile.followers_count,
		follow_id: profile.id === clickedProfile.id ? null : profile.follow_id,
		following_count: profile.is_owner
			? profile.following_count - 1
			: profile?.following_count,
	};
};