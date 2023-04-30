import React from 'react';
import { PostViewWithUser } from '~/types/PostView.types';

type Props = {
    postProp: PostViewWithUser
}

const PostView = ({postProp} : Props) => {
    const {author, post} = postProp
    return <div className="w-full border-b border-slate-400 p-8 flex gap-5" key={post?.id}>
    <img src={author?.profileImageUrl} alt="" className=" w-10 h-10 rounded-full" />
    {post?.content}
  </div>
}

export default PostView;