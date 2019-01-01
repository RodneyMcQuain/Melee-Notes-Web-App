import * as React from 'react';
import { IUser } from 'ClientApp/helpers/interfaces';
import { RouteComponentProps } from 'react-router';
import { PasswordValidation } from './PasswordValidation';
import { formatDate } from '../../helpers/formatDate';

interface RegistrationState {
    user: IUser;
    passwordCheck: string;
    isEmailValid: boolean;
    isEmailNotEmpty: boolean;
    isUsernameNotEmpty: boolean;
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
            isEmailValid: false,
            isEmailNotEmpty: false,
            isUsernameNotEmpty: false,
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
        const { user, passwordCheck, isEmailNotEmpty, isEmailValid, isUsernameNotEmpty,
            isPasswordMatch, hasPasswordLength, hasPasswordNumber, hasPasswordLowercase,
            hasPasswordUppercase, hasPasswordSymbol } = this.state;

        const possibleErrors = [isEmailNotEmpty, isEmailValid, isUsernameNotEmpty,
            isPasswordMatch, hasPasswordLength, hasPasswordNumber, hasPasswordLowercase,
            hasPasswordUppercase, hasPasswordSymbol];

        const isButtonEnabled = this.isButtonEnabled(possibleErrors);
        console.log(isButtonEnabled);
        let registerButton = isButtonEnabled
            ? <input type="submit" value="Register" className="btn" /> 
            : <input type="submit" value="Register" className="btn" disabled />

        let usernameValidationClassName = isUsernameNotEmpty ? "valid" : "invalid";

        let emailValidationArray = [isEmailNotEmpty, isEmailValid]
        let emailValidationClassNames = emailValidationArray.map(isValid => {
            if (isValid)
                return "valid";
            else
                return "invalid";
        });

        return (
            <div>
                <h1>Register</h1>

                <form onSubmit={ this.handleSubmit } >
                    <label>Username</label>
                    <input type="text" name="username" className="form-control input-md" placeholder="Username" value={ user.username } onChange={ e => this.handleUsernameChange(e) } />
                    <p className={ usernameValidationClassName }>Username is not empty</p>

                    <label>Email</label>
                    <input type="text" name="email" className="form-control input-md" placeholder="Email" value={ user.email } onChange={ e => this.handleEmailChange(e) } />
                    <p className={ emailValidationClassNames[0] }>Email is not empty</p>
                    <p className={ emailValidationClassNames[1] }>Email is valid</p>

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
        let user = this.state.user;
        user.username = username;

        this.setState({
            user: user,
            isUsernameNotEmpty: isUsernameNotEmpty
        });
    }

    private handleEmailChange(event: React.ChangeEvent<HTMLInputElement>) {
        const email = event.target.value;
        const isEmailValid = this.isEmailValid(email);
        const isEmailNotEmpty = this.isNotEmpty(email);
        let user = this.state.user;
        user.email = email;

        this.setState({
            user: user,
            isEmailValid: isEmailValid,
            isEmailNotEmpty: isEmailNotEmpty
        });
    }

    private isEmailValid(email: string) {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (email.match(emailRegex))
            return true;
        else
            return false;
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        })
            .then(() => this.props.history.push('/login'));
        //catch
    }

    private modifyUserBeforePost(user: IUser): IUser {
        user.email = user.email.trim();
        user.username = user.username.trim();
        let today = new Date().toString();
        user.dateCreated = formatDate(today);

        return user;
    }
}