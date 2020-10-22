import { userService } from '../_services/user_service';
import { history } from '../_helpers/history';

export const userActions = {
    login,
    logout
};


function login(email:any, password:any){

    let apiEndpoint = '/auth/sign-in';
    let payload = {
        email: email,
        password: password
    }
    console.log("payload: "+ payload);
    userService.post(apiEndpoint, payload)
    .then(response => {
        if (response) {
            localStorage.setItem('token', response.data.accessToken);
            localStorage.setItem('auth', 'true');
            setUserDetails(response.data);
            history.push('/administrator');
            window.location.reload();
        }
    }).catch(error => {
        console.log(error);
    })
}

function logout(){
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    logoutUser();
    history.push('/');
    window.location.reload();
}

export function setUserDetails(user:any){
    return{
        type: "LOGIN_SUCCESS",
        auth: user.auth,
        token: user.token
    }
}
export function logoutUser(){
    return{
        type: "LOGOUT_SUCCESS",
        auth: false,
        token: ''
    }
}