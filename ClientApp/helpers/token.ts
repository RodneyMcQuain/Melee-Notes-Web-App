import { IToken } from "./interfaces";

export let Token = (function () {
    let isAuthenticated = false;
    let userId = "";
    let token = {} as IToken;
    let USER_LOCAL_STORAGE_NAME = "user"

    const decodeToken = (token: string) => {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let decodedToken = JSON.parse(window.atob(base64));

        return decodedToken;
    }

    const getUser = (): IToken | null => {
        let user: string | null = localStorage.getItem("user")

        if (user) {
            let userJson = JSON.parse(user);
            return userJson;
        }

        return null;
    }

    const getToken = (): string | null => {
        let user = getUser();

        if (user)
            return user.token;

        return null;
    }

    let TokenObj = {
        setToken: function(token: IToken) {
            let tokenString = token.token;
            let decodedToken = decodeToken(tokenString);

            decodedToken.token = tokenString;

            isAuthenticated = true;
            userId = decodedToken.userId;

            localStorage.setItem(USER_LOCAL_STORAGE_NAME, JSON.stringify(decodedToken));
        },

        isUserAuthenticated: function() {
            let user = getUser();

            isAuthenticated = false;
            if (user) {
                if (decodeToken(user.token).exp < Date.now() / 1000) {
                    localStorage.removeItem(USER_LOCAL_STORAGE_NAME);
                    isAuthenticated = false;
                    userId = "0";
                } else {
                    isAuthenticated = true;
                }
            }

            return isAuthenticated;
        },

        getUserId: function() {
            let user = getUser();

            if (user) {
                userId = user.userId.toString();
            }

            return userId;
        },

        getAuthorizationHeaders: function() {
            return {
                'Authorization': "Bearer " + getToken(),
                'Content-Type': 'application/json'
            };
        },

        logout: function() {
            isAuthenticated = false;

            localStorage.removeItem(USER_LOCAL_STORAGE_NAME);
        }
    }

    return TokenObj;
}());
