import { useUser } from '@clerk/nextjs';
import React from 'react';
import Image from 'next/image'
import style from './style.module.css'

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

const CreatePostWizard = () => {

    const {user} = useUser();
    
    if(!user) return null;
    
    return <div className={style.sample}>
            <img src={user?.profileImageUrl!} alt={'user image'} className={'w-12 h-12 rounded-full'} />
            <input type="text" placeholder='please type emoji' />
            <FontAwesomeIcon icon={faPaperPlane} className=' h-16 w-10 cursor-pointer' />
    </div>;
}

export default CreatePostWizard;