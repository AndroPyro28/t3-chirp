import { useUser } from '@clerk/nextjs';
import { NextPage } from 'next';
import React from 'react';
import { api } from '~/utils/api';

type serverSidePropTypes = {
    message: string
}
const index: NextPage<serverSidePropTypes> = ({message}: serverSidePropTypes) => {

    const { mutate, error, isLoading } = api.post.create.useMutation();
    const {user} = useUser()
    const newPost = {
        content: '❤❤❤',
        authorId: user?.id!
    }


    if(isLoading) return <div>loading...</div>
    
    return <form onSubmit={(e) => {
        e.preventDefault();
        mutate(newPost);
      }}>
        <button type='submit'>submit</button>
        {error?.data?.zodError?.fieldErrors.title && (
            <span className="mb-8 text-red-500">
              {error?.data?.zodError?.fieldErrors.title}
            </span>
          )}

      </form>
}

export default index;

export const getServerSideProps = (context: any) => {
    return {
        props: {
            message: 'hello world'
        }
    }
}