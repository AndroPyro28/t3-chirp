import React, { useState } from "react";
import { PostViewWithUser } from "~/types/PostView.types";
import { format } from "timeago.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPen } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";
import { useUser } from "@clerk/nextjs";
type Props = {
  postProp: PostViewWithUser;
};

const PostView = ({ postProp }: Props) => {
  const [edit, setEdit] = useState(false);
  const [editContent, setEditContent] = useState<string>("");
  const userData = useUser();
  const { user } = userData;

  const utils = api.useContext();

  const { mutate: mutateDelete } = api.post.delete.useMutation({
    async onMutate(newPost) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic
      await utils.post.getAll.cancel();
      // Get the data from the queryCache
      const prevData = utils.post.getAll.getData();
      // Optimistically update the data with our new post
      // utils.post.getAll.setData(undefined, (oldPosts) => [...oldPosts?.filter(post => post.post.id != postProp.post.id)]);
      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newPost, ctx) {
      utils.post.getAll.setData(undefined, ctx?.prevData);
    },
    onSettled() {
      utils.post.getAll.invalidate();
    },
  });

  const { mutate: mutateEdit } = api.post.update.useMutation({
    async onMutate(newPost) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic
      await utils.post.getAll.cancel();
      // Get the data from the queryCache
      const prevData = utils.post.getAll.getData();
      //  Optimistically update the data with our new post
      // utils.post.getAll.setData(undefined, (oldPosts) => [...oldPosts?.filter(post => post.post.id != postProp.post.id)]);
      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newPost, ctx) {
      const errMessage = JSON.parse(err.message)[0].message;
      alert(errMessage)
      utils.post.getAll.setData(undefined, ctx?.prevData);
    },
    onSuccess() {
      alert('Post Updated')
      utils.post.getAll.invalidate();
    },
  });

  const { author, post } = postProp;

  const handleDeletePost = () => {
    const consent = window.confirm("are you sure you to delete this post?");

    if (consent) mutateDelete(post.id);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditContent((prev) => e.target.value);
  };

  const handleUpdatePost = () => {
    if (!edit) {
      setEdit(true);
    } else {
      const consent = window.confirm("are you sure you to update this post?");

      if (consent && editContent) {
        mutateEdit({
          content: editContent,
          postId: post.id,
        });
      }
      setEdit(false);
    }
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      handleUpdatePost();
    }
  };

  return (
    <div className="flex w-full flex-col border-b border-slate-400">
      <div className="relative flex gap-5 p-8" key={post?.id}>
        <img
          src={author?.profileImageUrl}
          alt=""
          className="h-10 w-10 rounded-full"
        />
        <div>
          {" "}
          {edit ? (
            <input
              value={editContent}
              placeholder="update then enter"
              className="h-full w-full rounded-md border bg-slate-200 px-3 text-black outline-none"
              onChange={handleChange}
              onKeyDown={handleEnter}
            />
          ) : (
            <span className=" text-xl">{post?.content}</span> 
          )}
        </div>

        {userData.isSignedIn && author.id === user?.id && (
          <>
            <FontAwesomeIcon
              icon={faPen}
              className="h4 absolute right-16 top-2.5 w-5 cursor-pointer"
              onClick={handleUpdatePost}
            />
            <FontAwesomeIcon
              icon={faTrash}
              className="h4 absolute right-5 top-2 w-5 cursor-pointer"
              onClick={handleDeletePost}
            />
          </>
        )}

        <div className=" absolute bottom-2 right-2">
          {format(post.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default PostView;
