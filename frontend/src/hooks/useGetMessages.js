import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAuthContext } from '../context/AuthContext.jsx';


const useGetMessages = () => {
    const [loading, setLoading] = useState(false);
    const { authUser } = useAuthContext();
    console.log(authUser)
    const getMessages = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/message/${authUser.hostel}`)
            const data = await res.json();
            console.log(data);
            if (data.error) throw new Error(data.error);

            return data;


        } catch (error) {
            toast.error(error.message)
            return false;
        } finally {
            setLoading(false);
        }
    }

    return { loading, getMessages }
}

export default useGetMessages