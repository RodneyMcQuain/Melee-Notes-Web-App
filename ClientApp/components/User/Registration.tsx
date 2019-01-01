import * as React from 'react';
import { IUser } from 'ClientApp/helpers/interfaces';
import { RouteComponentProps } from 'react-router';
import { PasswordValidation } from './PasswordValidation';
import { formatDate } from '../../helpers/formatDate';

interface RegistrationState {
    user: IUser;
    passwordCheck: string;
    isEmailNotEmpty: boolean;
    isEmailValid: boolean;
    isEmailDuplicate: boolean;
    isUsernameNotEmpty: boolean;
    isUsernameDuplicate: boolean;
    isPasswordMatch: boolean;
    hasPasswordLength: boolean;
    hasPasswordNumber: boolean;
    hasPasswordLowercase: boolean;
    hasPasswordUppercase: boolean;
    hasPasswordSymbol: boolean;
}

export class Registration extends React.Component<RouteComponentProps<{}>, RegistrationState> {
    constructor() {
        super();

        this.state = {
            user: {} as IUser,
            passwordCheck: "",
            isEmailNotEmpty: false,
            isEmailValid: false,
            isEmailDuplicate: false,
            isUsernameNotEmpty: false,
            isUsernameDuplicate: false,
            isPasswordMatch: false,
            hasPasswordLength: false,
            hasPasswordNumber: false,
            hasPasswordLowercase: false,
            hasPasswordUppercase: false,
            hasPasswordSymbol: false
        }

        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordCheckChange = this.handlePasswordCheckChange.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public render() {
        const { user, passwordCheck, isEmailNotEmpty, isEmailValid, isEmailDuplicate, isUsernameNotEmpty,
            isUsernameDuplicate, isPasswordMatch, hasPasswordLength, hasPasswordNumber,
            hasPasswordLowercase, hasPasswordUppercase, hasPasswordSymbol } = this.state;

        const possibleErrors = [isEmailNotEmpty, isEmailValid, isEmailDuplicate, isUsernameNotEmpty,
            isUsernameDuplicate, isPasswordMatch, hasPasswordLength, hasPasswordNumber, hasPasswordLowercase,
            hasPasswordUppercase, hasPasswordSymbol];

        const isButtonEnabled = this.isButtonEnabled(possibleErrors);
        let registerButton = isButtonEnabled
            ? <input type="submit" value="Register" className="btn" /> 
            : <input type="submit" value="Register" className="btn" disabled />

        let usernameValidationArray = [isUsernameNotEmpty, isUsernameDuplicate]
        let usernameValidationClassNames = usernameValidationArray.map(isValid => this.setValidity(isValid));

        let emailValidationArray = [isEmailNotEmpty, isEmailValid, isEmailDuplicate]
        let emailValidationClassNames = emailValidationArray.map(isValid => this.setValidity(isValid));

        return (
            <div>
                <h1>Register</h1>

                <form onSubmit={ this.handleSubmit } >
                    <label>Username</label>
                    <input type="text" name="username" className="form-control input-md" placeholder="Username" value={ user.username } onChange={ e => this.handleUsernameChange(e) } />
                    <p className={ usernameValidationClassNames[0] }>Username is not empty</p>
                    <p className={ usernameValidationClassNames[1] }>Username is available</p>

                    <label>Email</label>
                    <input type="text" name="email" className="form-control input-md" placeholder="Email" value={ user.email } onChange={ e => this.handleEmailChange(e) } />
                    <p className={ emailValidationClassNames[0] }>Email is not empty</p>
                    <p className={ emailValidationClassNames[1] }>Email is valid</p>
                    <p className={ emailValidationClassNames[2] }>Email is available</p>

                    <label>Password</label>
                    <input type="password" name="password" className="form-control input-md" placeholder="Password" value={ user.password } onChange={ e => this.handlePasswordChange(e) } />

                    <label>Re-Enter Password</label>
                    <input type="password" name="passwordCheck" className="form-control input-md" placeholder="Re-Enter Password" value={ passwordCheck } onChange={ e => this.handlePasswordCheckChange(e) } />

                    <PasswordValidation
                        isPasswordMatch={ isPasswordMatch }
                        hasPasswordLength={ hasPasswordLength }
                        hasPasswordNumber={ hasPasswordNumber }
                        hasPasswordLowercase={ hasPasswordLowercase }
                        hasPasswordUppercase={ hasPasswordUppercase }
                        hasPasswordSymbol={ hasPasswordSymbol }
                    />

                    { registerButton }
                </form>
            </div>
        );
    }

    private setValidity(isValid: boolean) {
        if (isValid) return "valid";
        else return "invalid";
    }

    private isButtonEnabled(possibleErrors: boolean[]) {
        let isError = false;

        possibleErrors.map(validationType => {
            if (!validationType)
                isError = true;
        });

        if (isError)
            return false;
        else
            return true;
    }

    private handleUsernameChange(event: React.ChangeEvent<HTMLInputElement>) {
        const username = event.target.value;
        const isUsernameNotEmpty = this.isNotEmpty(username);
        const isUsernameDuplicate = this.isUsernameDuplicate(username);
        let user = this.state.user;
        user.username = username;

        isUsernameDuplicate.then(isDuplicate => {
            this.setState({
                user: user,
                isUsernameNotEmpty: isUsernameNotEmpty,
                isUsernameDuplicate: isDuplicate
            });
        });
    }

    private isUsernameDuplicate(username: string): Promise<boolean> {
        return fetch(`api/User/CheckUsername/${username}`)
            .then(response => this.handleResponse(response))
            .catch(error => {
                console.log(error)
                return false;
            });
    }

    private handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        const email = event.target.value;
        const isEmailValid = this.isEmailValid(email);
        const isEmailNotEmpty = this.isNotEmpty(email);
        const isEmailDuplicate = this.isEmailDuplicate(email);
        let user = this.state.user;
        user.email = email;

        isEmailDuplicate.then(isDuplicate => {
            this.setState({
                user: user,
                isEmailNotEmpty: isEmailNotEmpty,
                isEmailValid: isEmailValid,
                isEmailDuplicate: isDuplicate
            });
        });
    }

    private isEmailValid(email: string) {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email.match(emailRegex))
            return true;
        else
            return false;
    }

    private isEmailDuplicate(email: string): Promise<boolean> {
        return fetch(`api/User/CheckEmail/${email}`)
            .then(response => this.handleResponse(response))
            .catch(error => {
                console.log(error)
                return false;
            });
    }

    private isNotEmpty(text: string) {
        if (text.trim().length !== 0)
            return true;
        else
            return false;
    }

    private handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const password = event.target.value;
        let user = this.state.user;
        user.password = password;

        const isPasswordMatch = this.isPasswordMatch(password, this.state.passwordCheck);
        const hasPasswordLength = this.hasPasswordLength(password);
        const hasPasswordNumber = this.hasPasswordNumber(password);
        const hasPasswordLowercase = this.hasPasswordLowercase(password);
        const hasPasswordUppercase = this.hasPasswordUppercase(password);
        const hasPasswordSymbol = this.hasPasswordSymbol(password);

        this.setState({
            user: user,
            isPasswordMatch: isPasswordMatch,
            hasPasswordLength: hasPasswordLength,
            hasPasswordNumber: hasPasswordNumber,
            hasPasswordLowercase: hasPasswordLowercase,
            hasPasswordUppercase: hasPasswordUppercase,
            hasPasswordSymbol: hasPasswordSymbol
        });
    }

    private handlePasswordCheckChange(event: React.ChangeEvent<HTMLInputElement>) {
        const passwordCheck = event.target.value;
        const isPasswordMatch = this.isPasswordMatch(passwordCheck, this.state.user.password);

        this.setState({
            passwordCheck: passwordCheck,
            isPasswordMatch: isPasswordMatch
        });
    }

    private isPasswordMatch(password: string, passwordCheck: string) {
        if (password === passwordCheck)
            return true;
        else
            return false;
    }

    private hasPasswordLength(password: string) {
        const PASSWORD_MIN_LENGTH = 8;

        if (password.length >= PASSWORD_MIN_LENGTH)
            return true;
        else
            return false;
    }

    private hasPasswordNumber(password: string) {
        const numberRegex = /[0-9]/g;

        if (password.match(numberRegex))
            return true;
        else
            return false;
    }

    private hasPasswordLowercase(password: string) {
        const lowercaseLetterRegex = /[a-z]/g;

        if (password.match(lowercaseLetterRegex))
            return true;
        else
            return false;
    }

    private hasPasswordUppercase(password: string) {
        const uppercaseLetterRegex = /[A-Z]/g;

        if (password.match(uppercaseLetterRegex))
            return true;
        else
            return false;
    }

    private hasPasswordSymbol(password: string) {
        const symbolRegex = /[/?/!@#/$%/^&*]/g;

        if (password.match(symbolRegex))
            return true;
        else
            return false;
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();
        let user = this.state.user;
        user = this.modifyUserBeforePost(user);

        fetch(`api/User/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => this.handleResponse(response))
            .then(() => this.props.history.push('/login'))
            .catch(error => console.log(error));
    }

    private modifyUserBeforePost(user: IUser): IUser {
        user.email = user.email.trim();
        user.username = user.username.trim();
        let today = new Date().toString();
        user.dateCreated = formatDate(today);

        return user;
    }

    private handleResponse(response: Response) {
        let statusCode = response.status;

        if (response.ok) {
            return true;
        } else if (statusCode === 400) {
            throw new Error("400");
        } else if (statusCode >= 500) {
            throw new Error(response.status.toString());
        } else {
            return false;
        }
    }
}