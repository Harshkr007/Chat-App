import React from 'react'
import Avatar from './Avatar'
import { Link } from 'react-router-dom'


function UserSearchCard({user,onClose}) {
  return (
   <Link  to = {`/${user?._id}`}
      onClick={onClose}
    className='flex items-center gap-3 p-2 lg:p-4 border border-transparent border-b-slate-200 hover:border hover:border-primary rounded cursor-pointer'>
        <div>
          <Avatar
            width = {50}
            height={50}
            name={user?.name}
            imageUrl={user?.profile_pic}
            userId={user?._id}
          />
        </div>
        <div className='font-semibold text-ellipsis line-clamp-1'>
          {user?.name}
        </div>
        <p className='text-sm'>{user?.email}</p>
   </Link>
  )
}

export default UserSearchCard