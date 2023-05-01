import React from 'react';
import { api } from "~/utils/api";
import PostView from './PostView';
import Loader from './Loader';

const Posts = () => {

    const { data: posts, isLoading, isError } = api.post.getAll.useQuery();
    const fetchPosts = posts?.map((post) => <PostView postProp={post} />)

    if(isLoading) return <Loader size={30} />
    if (isError) return <div>Something went wrong</div>
  
    return <>{fetchPosts}</>
}

export default Posts;