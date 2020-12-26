import axios from 'axios';

export const axiosConfig = () =>
    axios.create({
        baseURL: process.env.REACT_APP_PUBLIC_URL,
        headers: {
            Authorization: `Bearer ${localStorage?.getItem("token")}`
        }
    })
