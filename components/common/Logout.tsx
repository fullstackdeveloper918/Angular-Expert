import { clearUserData } from '@/lib/features/userSlice';
import { auth } from '@/utils/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import { destroyCookie, parseCookies } from 'nookies';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const Logout = (props:any) => {
  
    const router = useRouter()
    const dispatch = useDispatch();
    const getUserdata = useSelector((state: any) => state?.user?.userData);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    useEffect(() => {
      const cookies = parseCookies();
      const token = cookies["COOKIES_USER_ACCESS_TOKEN"];
      setAccessToken(token);
    }, []);
    const [loading, setLoading] = useState(false)
    const handleLogout = async () => {
        try {
          setLoading(true)
          await signOut(auth)
           
             destroyCookie(null, "COOKIES_USER_ACCESS_TOKEN", { path: '/' });
           dispatch(clearUserData({}));
           toast.success("Logout Successful", {
             position: "top-center",
             autoClose: 300,
             onClose: () => {
             },
           });
           router.push("/auth/signin");
          
        } catch (error) {
          setLoading(false)
        }
      };
      return(
        <>
        </>
      )
}

export default Logout