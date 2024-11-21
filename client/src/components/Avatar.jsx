import React from 'react'
import { PiUserCircle } from "react-icons/pi";
import { useSelector } from 'react-redux';

const Avatar = ({userId, name, imageUrl, width, height}) => {
    const onlineUser = useSelector((state) => state.user.onlineUser);



    let avatarName = ""

    if(name){
      const splitName = name?.split(" ")
      if(splitName.length > 1){
        avatarName = splitName[0][0]+splitName[1][0]
      }else{
        avatarName = splitName[0][0]
      }
    }

    const bgColor = [
      'bg-slate-200',
      'bg-teal-200',
      'bg-red-200',
      'bg-green-200',
      'bg-yellow-200',
      'bg-gray-200',
      "bg-cyan-200",
      "bg-sky-200",
      "bg-blue-200"
    ]

    const randomNumber = Math.floor(Math.random() * 9)
    const isOnline = onlineUser.includes(userId);

    return (
        <div className="relative aspect-square" style={{width: width+"px"}}>
            {imageUrl ? (
                <div className="w-full h-full rounded-full overflow-hidden">
                    <img
                        src={imageUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                    />
                </div>
            ) : name ? (
                <div className={`w-full h-full rounded-full flex justify-center items-center text-slate-800 font-bold ${bgColor[randomNumber]}`}>
                    <span className="text-[calc(width/2.5)]">
                        {avatarName}
                    </span>
                </div>
            ) : (
                <div className="w-full h-full flex items-center justify-center">
                    <PiUserCircle className="w-full h-full text-slate-800" />
                </div>
            )}
            {
                isOnline && (
                    <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-green-500 border-2 border-white"></div>
                )
            }
        </div>
    )
}

export default Avatar
