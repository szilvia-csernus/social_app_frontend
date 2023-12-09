import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction } from "react";
import { PostType, PostsResponseType } from "../pages/posts/PostTypes";

export type ResourceType = 
    PostsResponseType;

type ResultType = 
	PostType;



export const fetchMoreData = async (
	fetchFunction: (path: string) => Promise<AxiosResponse<object> | null>,
	resource: ResourceType,
	setResource: Dispatch<SetStateAction<ResourceType>>
) => {
	try {
		const response = await fetchFunction((resource as ResourceType).next);
        if (response) {
            const { data } = response
            setResource((prevResource: ResourceType) => ({
							...prevResource,
							next: (data as ResourceType).next,
							results: (data as ResourceType).results.reduce(
								(acc: ResultType[], cur: ResultType) => {
									return acc.some(
										(accResult: ResultType) => accResult.id === cur.id
									)
										? acc
										: [...acc, cur];
								},
								prevResource.results
							),
						}));
        }
		
	} catch (err) {
		console.error(err);
	}
};