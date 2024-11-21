import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../store/userSlice";
import SearchUser from "./SearchUser";
import EditUserDetails from "./EditUserDetails";
import Avatar from "./Avatar";

//icons
import { FiArrowUpLeft } from "react-icons/fi";
import { BsChatDotsFill } from "react-icons/bs";
import { HiUserAdd } from "react-icons/hi";
import { TbLogout } from "react-icons/tb";
import { PiImageFill } from "react-icons/pi";
import { FaVideo } from "react-icons/fa6";

function SideBar() {
  const user = useSelector((state) => state?.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const [allUser, setAllUser] = useState([]);
  const [editUserOpen, setEditUserOpen] = useState(false);
  const [openSearchuser, setOpenSearchuser] = useState(false);

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("sidebar", user._id);

      const handleConversation = (data) => {
        const conversationUserData = data.map((conversationUser) => {
          if (
            conversationUser?.sender?._id === conversationUser?.receiver?._id
          ) {
            return {
              ...conversationUser,
              userDetails: conversationUser?.sender,
            };
          } else if (conversationUser?.receiver?._id !== user?._id) {
            return {
              ...conversationUser,
              userDetails: conversationUser.receiver,
            };
          } else {
            return {
              ...conversationUser,
              userDetails: conversationUser.sender,
            };
          }
        });

        setAllUser(conversationUserData);
      };

      socketConnection.on("conversation", handleConversation);

      return () => {
        socketConnection.off("conversation", handleConversation);
      };
    }
  }, [socketConnection, user._id]);

  const handleLogout = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/logout`;
      const token = localStorage.getItem("accessToken");

      const response = await axios.post(
        URL,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      socketConnection?.disconnect();
      dispatch(logout());
      localStorage.clear();
      toast.success(response?.data?.message || "Logout successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed!");
    }
  };

  return (
    <div className="w-full h-full grid grid-cols-[48px,1fr]">
      <div className="bg-slate-200 w-12 h-full rounded-tr-lg rounded-br-lg py-5 text-slate-600 flex flex-col justify-between">
        <div>
          <NavLink
            className={({ isActive }) =>
              `w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded ${
                isActive && "bg-slate-300"
              }`
            }
            title="chat"
          >
            <BsChatDotsFill size={25} />
          </NavLink>
          <div
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-200 rounded"
            title="add friend"
            onClick={() => setOpenSearchuser((prev) => !prev)}
          >
            <HiUserAdd size={25} />
          </div>
        </div>
        <div className="flex flex-col items-center ">
          <button
            className="mx-auto hover:bg-slate-300 rounded"
            title={user?.name}
            onClick={() => setEditUserOpen(true)}
          >
            <Avatar
              width={40}
              height={40}
              name={user?.name}
              imageUrl={user?.profile_pic}
              userId={user?._id}
            />
          </button>
          <button
            title="logout"
            className="w-12 h-12 flex justify-center items-center cursor-pointer hover:bg-slate-300 rounded"
            onClick={handleLogout}
          >
            <span>
              <TbLogout size={25} />
            </span>
          </button>
        </div>
      </div>

      <div className="w-full h-full">
        <div className="h-16 flex items-center">
          <h2 className="text-lg font-bold p-4 text-slate-800 h-16">Message</h2>
        </div>
        <div className="bg-slate-200 p-[0.5px]"></div>
        <div className=" bg-red-300 h-[calc(100vh-65px)] overflow-x-hidden overflow-y-auto scrollbar">
          {allUser.length == 0 && (
            <div className="mt-12">
              <div className="flex justify-center items-center my-4 text-slate-400">
                <FiArrowUpLeft size={50} />
              </div>
              <p className="text-lg text-center text-slate-400">
                Explore users to start a conversation
              </p>
            </div>
          )}

          {allUser.map((conv, index) => {
            return (
              <NavLink
                to={"/" + conv?.userDetails?._id}
                key={conv?._id}
                className="flex items-center gap-2 py-3 px-2 border border-transparent hover:border-primary rounded hover:bg-slate-100 cursor-pointer"
              >
                <div>
                  <Avatar
                    imageUrl={conv?.userDetails?.profile_pic}
                    name={conv?.userDetails?.name}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <h3 className="text-ellipsis line-clamp-1 font-semibold text-base">
                    {conv?.userDetails?.name}
                  </h3>
                  <div className="text-slate-500 text-xs flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      {conv?.lastMsg?.imageUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <PiImageFill />
                          </span>
                          {!conv?.lastMsg?.text && <span>Image</span>}
                        </div>
                      )}
                      {conv?.lastMsg?.videoUrl && (
                        <div className="flex items-center gap-1">
                          <span>
                            <FaVideo />
                          </span>
                          {!conv?.lastMsg?.text && <span>Video</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-ellipsis line-clamp-1">
                      {conv?.lastMsg?.text}
                    </p>
                  </div>
                </div>
                {Boolean(conv?.unseenMsg) && (
                  <p className="text-xs w-6 h-6 flex justify-center items-center ml-auto p-1 bg-primary text-white font-semibold rounded-full">
                    {conv?.unseenMsg}
                  </p>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/**Edit user details */}
      {editUserOpen && (
        <EditUserDetails onClose={() => setEditUserOpen(false)} user={user} />
      )}

      {/**search user */}
      {openSearchuser && (
        <SearchUser onClose={() => setOpenSearchuser(false)} />
      )}
    </div>
  );
}

export default SideBar;
