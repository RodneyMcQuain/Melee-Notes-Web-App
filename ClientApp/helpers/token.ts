import { IToken } from "./interfaces";

export let isAuthenticated = false;

export const getCurrentUserId = () => {
    return userId;
}

export const getAuthorizationHeaders = () => {
    return {
        'Authorization': "Bearer " + getToken(),
        'Content-Type': 'application/json'
    };
}

export const getUser = (): IToken | null => {
    let user: string | null = localStorage.getItem("user")

    if (user) {
        let userJson = JSON.parse(user);
        return userJson;
    }

    return null;
}

export const getToken = (): string | null => {
    let user = getUser();

    if (user)
        return user.token;

    return null;
}

export const setToken = (token: IToken) => {
    let tokenString = token.token;
    let decodedToken = decodeToken(tokenString);

    decodedToken.token = tokenString;

    isAuthenticated = true;
    userId = decodedToken.userId;

    localStorage.setItem("user", JSON.stringify(decodedToken));
}

const decodeToken = (token: string) => {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let decodedToken = JSON.parse(window.atob(base64));

    return decodedToken;
}

export const logout = () => {
    isAuthenticated = false;

    localStorage.removeItem("user");
}

let user = getUser();
let userId = "";
// Initialize userId if user token hasn't expired since last run of app
if (user) {
    if (decodeToken(user.token).exp < Date.now() / 1000)
        localStorage.clear();
    else {
        userId = user.userId.toString();
        isAuthenticated = true;
    }
}