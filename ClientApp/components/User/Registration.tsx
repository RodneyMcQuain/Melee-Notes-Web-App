import * as React from 'react';
import { IUser } from 'ClientApp/helpers/interfaces';
import { RouteComponentProps } from 'react-router';
import { formatDate } from '../../helpers/formatDate';
import { Preloader } from '../General/Preloader';
import { TITLE_PREFIX } from '../../helpers/constants';
import { PasswordValidation } from './PasswordValidation';
import { handleResponse } from '../../helpers/handleResponseErrors';
import { UsernameValidationText } from './UsernameValidationText';

interface RegistrationState {
    user: IUser;
    passwordCheck: string;
    isLoading: boolean;
    isEmailNotEmpty: boolean;
    isEmailValid: boolean;
    isEmailDuplicate: boolean;
    isUsernameNotEmpty: boolean;
    isUsernameDuplicate: boolean;
    isPasswordValid: boolean;
}

export class Registration extends React.Component<RouteComponentProps<{}>, RegistrationState> {
    constructor(props: RouteComponentProps<{}>) {
        super(props);

        this.state = {
            user: {} as IUser,
            passwordCheck: "",
            isLoading: false,
            isEmailNotEmpty: false,
            isEmailValid: false,
            isEmailDuplicate: false,
            isUsernameNotEmpty: false,
            isUsernameDuplicate: false,
            isPasswordValid: false
        }

        this.setArrayValidity = this.setArrayValidity.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handlePasswordCheckChange = this.handlePasswordCheckChange.bind(this);
        this.handlePasswordValidity = this.handlePasswordValidity.bind(this);
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    public componentDidMount() {
        document.title = TITLE_PREFIX + "Registration";
    }

    public render() {
        const { user, passwordCheck, isLoading, isEmailNotEmpty, isEmailValid, isEmailDuplicate, isUsernameNotEmpty,
            isUsernameDuplicate, isPasswordValid } = this.state;

        const possibleErrors = [isEmailNotEmpty, isEmailValid, isEmailDuplicate, isUsernameNotEmpty,
            isUsernameDuplicate, isPasswordValid];

        const isButtonEnabled = this.isButtonEnabled(possibleErrors);
        let registerButton = isButtonEnabled
            ? <input type="submit" value="Register" className="btn" /> 
            : <input type="submit" value="Register" className="btn" disabled />

        let emailValidationArray = [isEmailNotEmpty, isEmailValid, isEmailDuplicate]
        let emailValidationClassNames = this.setArrayValidity(emailValidationArray);

        if (isLoading)
            return <Preloader />
        else
            return (
                <div className="registration-container -center-container -curved-border" >
                    <h1>Register</h1>

                    <form onSubmit={ this.handleSubmit } >
                        <label>Username</label>
                        <input type="text" name="username" className="form-control input-md" placeholder="Username" value={ user.username } onChange={ e => this.handleUsernameChange(e) } />
                        <UsernameValidationText
                            isUsernameNotEmpty={ isUsernameNotEmpty }
                            isUsernameDuplicate={ isUsernameDuplicate }
                            setArrayValidity={ this.setArrayValidity }
                        />

                        <label>Email</label>
                        <input type="text" name="email" className="form-control input-md" placeholder="Email" value={ user.email } onChange={ e => this.handleEmailChange(e) } />
                        <p className={ emailValidationClassNames[0] }>Email is not empty</p>
                        <p className={ emailValidationClassNames[1] }>Email is valid</p>
                        <p className={ emailValidationClassNames[2] }>Email is available</p>

                        <PasswordValidation
                            password={ user.password } 
                            passwordCheck={ passwordCheck } 
                            handlePasswordChange={ this.handlePasswordChange } 
                            handlePasswordCheckChange={ this.handlePasswordCheckChange } 
                            handlePasswordValidity={ this.handlePasswordValidity }
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

    private setArrayValidity(validityArray: boolean[]): string[] {
        return validityArray.map(isValid => this.setValidity(isValid));
    }

    private isButtonEnabled(possibleErrors: boolean[]): boolean {
        let isError = false;

        possibleErrors.map(validationType => {
            if (!validationType)
                isError = true;
        });

        return !isError;
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
            .then(response => handleResponse(this.props.history, response))
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

        return email.match(emailRegex);
    }

    private isEmailDuplicate(email: string): Promise<boolean> {
        return fetch(`api/User/CheckEmail/${email}`)
            .then(response => handleResponse(this.props.history, response))
            .catch(error => {
                console.log(error)
                return false;
            });
    }

    private isNotEmpty(text: string) {
        return text.trim().length !== 0;
    }

    private handlePasswordValidity(isPasswordValid: boolean) {
        this.setState({ isPasswordValid: isPasswordValid });
    }

    private handlePasswordCheckChange(event: React.ChangeEvent<HTMLInputElement>) {
        const passwordCheck = event.target.value;

        this.setState({ passwordCheck: passwordCheck });
    }

    private handlePasswordChange(event: React.ChangeEvent<HTMLInputElement>) {
        const password = event.target.value;
        let user = this.state.user;
        user.password = password;

        this.setState({ user: user });
    }

    public handleSubmit(event: React.FormEvent<EventTarget>) {
        event.preventDefault();
        let user = this.state.user;
        user = this.modifyUserBeforePost(user);

        this.setState({ isLoading: true });

        fetch(`api/User/`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => handleResponse(this.props.history, response))
            .then(() => {
                this.setState({ isLoading: false });

                this.props.history.push('/login');
            })
            .catch(error => {
                this.setState({ isLoading: false });

                console.log(error);
            });
    }

    private modifyUserBeforePost(user: IUser): IUser {
        user.email = user.email.trim();
        user.username = user.username.trim();
        let today = new Date().toString();
        user.dateCreated = formatDate(today);

        return user;
    }
}