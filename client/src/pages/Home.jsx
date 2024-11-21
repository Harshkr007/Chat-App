import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setsocketConnection, setUser } from '../store/userSlice';
import toast from 'react-hot-toast';
import SideBar from '../components/SideBar';
import Logo from '../assets/logo.png';
import io from 'socket.io-client';

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.user);


  console.log("user :: ", user);

  const accessToken = useSelector((state) => state.user.accessToken);
  console.log(accessToken);

  const fetchUserDetails = async () => {
    try {
      const URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users/user-details`;
      const response = await fetch(URL, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      const data = await response.json();
      
      if (data.success) {
        dispatch(setUser(data.data));
        console.log(data.data);
      } else {
        data?.logout && dispatch(logout());
        toast.error(data.message);
        navigate('/login');
      }
    } catch (error) {
      toast.error("Failed to fetch user details");
    } 
  }

  useEffect(() => {
    fetchUserDetails();
  }, [])

  useEffect(() => {
    const socketConnection = io(import.meta.env.VITE_BACKEND_URL,{
      auth: {
        token: localStorage.getItem('accessToken')
      }
    });

    socketConnection.on('onlineUser', (users) => {
      console.log("online users :: ", users);
      dispatch(setOnlineUser(users));
    })

    dispatch(setsocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    }
  },[])

 

  console.log("location : ",location);
  const basePath = location.pathname === '/'

  return (
    <div className='grid lg:grid-cols-[320px,1fr] h-screen mx-h-screen'>

      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <SideBar/>
      </section>

      <section className={`${basePath && "hidden"}`}>
        <Outlet/>
      </section>

      <div className= {`justify-center items-center flex-col gap-2  ${!basePath ? "hidden" : "lg:flex"}`}>
        <div>
          <img
            src = {Logo}
            width={200}
            alt='logo'
          />
        </div>
        <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
      </div>
    </div>
  )
}

export default Home
