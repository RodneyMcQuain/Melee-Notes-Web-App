import * as React from 'react';
import { PasswordValidationText } from './PasswordValidationText';

interface PasswordValidationState {
    isPasswordMatch: boolean;
    hasPasswordLength: boolean;
    hasPasswordNumber: boolean;
    hasPasswordLowercase: boolean;
    hasPasswordUppercase: boolean;
    hasPasswordSymbol: boolean;
}

interface PasswordValidationProps {
    password: string;
    passwordCheck: string;
    handlePasswordChange: Function;
    handlePasswordCheckChange: Function;
    handlePasswordValidity: Function;
}

export class PasswordValidation extends React.Component<PasswordValidationProps, PasswordValidationState> {
    constructor(props: PasswordValidationProps) {
        super(props)

        this.state = {
            isPasswordMatch: false,
            hasPasswordLength: false,
            hasPasswordNumber: false,
            hasPasswordLowercase: false,
            hasPasswordUppercase: false,
            hasPasswordSymbol: false
        }
    }

    public render() {
        const { password, passwordCheck, handlePasswordChange, handlePasswordCheckChange } = this.props;
        const { isPasswordMatch, hasPasswordLength, hasPasswordNumber,
            hasPasswordLowercase, hasPasswordUppercase, hasPasswordSymbol } = this.state;

        return (
            <>
                <label>Password</label>
                <input type="password" name="password" className="form-control input-md" placeholder="Password" value={ password } onChange={ e => this.onChange_password(e, handlePasswordChange) } />

                <label>Re-Enter Password</label>
                <input type="password" name="passwordCheck" className="form-control input-md" placeholder="Re-Enter Password" value={ passwordCheck } onChange={ e => this.onChange_passwordCheck(e, handlePasswordCheckChange) } />

                <PasswordValidationText
                    isPasswordMatch={ isPasswordMatch }
                    hasPasswordLength={ hasPasswordLength }
                    hasPasswordNumber={ hasPasswordNumber }
                    hasPasswordLowercase={ hasPasswordLowercase }
                    hasPasswordUppercase={ hasPasswordUppercase }
                    hasPasswordSymbol={ hasPasswordSymbol }
                />
            </>
        );
    }

    private onChange_password(event: React.ChangeEvent<HTMLInputElement>, handlePasswordChange: Function) {
        handlePasswordChange(event)
        setTimeout(() => this.checkPassword(), 0);
    }

    private onChange_passwordCheck(event: React.ChangeEvent<HTMLInputElement>, handlePasswordCheckChange: Function) {
        handlePasswordCheckChange(event);
        setTimeout(() => this.checkPassword(), 0);
    }

    private checkPassword() {
        const { password, passwordCheck, handlePasswordValidity } = this.props;

        const isPasswordMatch = this.isPasswordMatch(password, passwordCheck);
        const hasPasswordLength = this.hasPasswordLength(password);
        const hasPasswordNumber = this.hasPasswordNumber(password);
        const hasPasswordLowercase = this.hasPasswordLowercase(password);
        const hasPasswordUppercase = this.hasPasswordUppercase(password);
        const hasPasswordSymbol = this.hasPasswordSymbol(password);

        const possibleErrors = [isPasswordMatch, hasPasswordLength, hasPasswordNumber, hasPasswordLowercase,
            hasPasswordUppercase, hasPasswordSymbol];
        const isValidPassword = this.isValidPassword(possibleErrors);

        this.setState({
            isPasswordMatch: isPasswordMatch,
            hasPasswordLength: hasPasswordLength,
            hasPasswordNumber: hasPasswordNumber,
            hasPasswordLowercase: hasPasswordLowercase,
            hasPasswordUppercase: hasPasswordUppercase,
            hasPasswordSymbol: hasPasswordSymbol
        },
            handlePasswordValidity(isValidPassword)
        );
    }

    private isValidPassword(possibleErrors: boolean[]) {
        let isError = false;

        possibleErrors.map(validationType => {
            if (!validationType)
                isError = true;
        });

        return !isError;
    }

    private isPasswordMatch(password: string, passwordCheck: string): boolean {
        return password === passwordCheck;
    }

    private hasPasswordLength(password: string): boolean {
        const PASSWORD_MIN_LENGTH = 8;

        return password.length >= PASSWORD_MIN_LENGTH;
    }

    private hasPasswordNumber(password: string): boolean {
        const numberRegex = /[0-9]/g;

        if (password.match(numberRegex))
            return true;

        return false;
    }

    private hasPasswordLowercase(password: string): boolean {
        const lowercaseLetterRegex = /[a-z]/g;

        if (password.match(lowercaseLetterRegex))
            return true;

        return false;
    }

    private hasPasswordUppercase(password: string): boolean {
        const uppercaseLetterRegex = /[A-Z]/g;

        
        if (password.match(uppercaseLetterRegex))
            return true;

        return false;
    }

    private hasPasswordSymbol(password: string): boolean {
        const symbolRegex = /[/?/!@#/$%/^&*]/g;

        if (password.match(symbolRegex))
            return true;

        return false;
    }
}
