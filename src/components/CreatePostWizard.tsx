import { useUser } from "@clerk/nextjs";
import React, { useState } from "react";
import Image from "next/image";
import style from "./style.module.css";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { api } from "~/utils/api";

const CreatePostWizard = () => {
  const [content, setContent] = useState<string>("");

  const { user } = useUser();

  if (!user) return null;
  const utils = api.useContext();

  const { mutate, error, isLoading, reset, data } = api.post.create.useMutation({

    async onMutate(newPost) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic
      await utils.post.getAll.cancel();

      // Get the data from the queryCache
      const prevData = utils.post.getAll.getData();
      // Optimistically update the data with our new post
    //   utils.post.getAll.setData(undefined, (oldPosts) => [
    //     ...oldPosts,
    //     {
    //         post: {
    //             content: newPost.content,
    //             createdAt: new Date(),
    //             updatedAt: new Date(),
    //             authorId: user.id
    //         },
    //         author: {
    //             id: user.id,
    //             username: user.username,
    //             profileImageUrl: user.profileImageUrl
    //         }
    //     },
    //   ]);
      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newPost, ctx) {
      const errMessage = JSON.parse(err.message)[0].message;
      alert(errMessage)
      utils.post.getAll.setData(undefined, ctx?.prevData);
    },
    onSuccess(data) {
      //success statement
    },
    onSettled: () => {
      utils.post.getAll.invalidate();
    }
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent((prev) => e.target.value);
  };

  const createPost = () => {
    if (!content) {
      alert("Content must be not empty");
    } else {
      setContent("");
      mutate({
        content,
        authorId: user.id,
      });

      reset();
    }
  };

  const handleClick = () => {
    createPost();
  };

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      createPost();
    }
  };

  if (isLoading) return <div>loading...</div>;
  return (
    <div className={style.sample}>
      <Image
        src={user.profileImageUrl}
        alt={"user image"}
        width={56}
        height={56}
        className={"h-12 w-12 rounded-full"}
      />
      <input
        type="text"
        placeholder="please type emoji"
        value={content}
        onChange={handleChange}
        onKeyDown={handleEnter}
      />
      <FontAwesomeIcon
        icon={faPaperPlane}
        className=" h-16 w-10 cursor-pointer"
        onClick={handleClick}
      />
    </div>
  );
};

export default CreatePostWizard;
