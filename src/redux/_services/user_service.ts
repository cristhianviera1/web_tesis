import axios from 'axios';
import config from '../config/config';

export const userService = {
    get,
    post,
    put,
    deleteDetail
};

function get(apiEndpoint:any){
    return axios.get(config.baseUrl+apiEndpoint).then((response)=>{
        console.log("Esta es la respuesta service: " + response);
       return response;
    }).catch((err)=>{
       console.log(err);
    })
}

async function post(apiEndpoint:any, payload:any){
    return await axios.post(config.baseUrl+apiEndpoint, payload).then( response =>{
        return response;
    }).catch((err)=>{
        console.log(err);
    })
}

function put(apiEndpoint:any, payload:any){
    return axios.put(config.baseUrl+apiEndpoint, payload).then((response)=>{
        return response;
    }).catch((err)=>{
        console.log(err);
    })
}

function deleteDetail(apiEndpoint:any){
    return axios.delete(config.baseUrl+apiEndpoint).then((response)=>{
        return response;
    }).catch((err)=>{
        console.log(err);
    })
}