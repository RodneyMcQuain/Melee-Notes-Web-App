import * as React from 'react';
import { IUser } from 'ClientApp/helpers/interfaces';
import { RouteComponentProps } from 'react-router';

interface PasswordValidationProps {
    isPasswordMatch: boolean;
    hasPasswordLength: boolean;
    hasPasswordNumber: boolean;
    hasPasswordLowercase: boolean;
    hasPasswordUppercase: boolean;
    hasPasswordSymbol: boolean;
}

export class PasswordValidation extends React.Component<PasswordValidationProps, {}> {
    public render() {
        const { isPasswordMatch, hasPasswordLength, hasPasswordNumber,
            hasPasswordLowercase, hasPasswordUppercase, hasPasswordSymbol } = this.props;

        let passwordValidationArray = [isPasswordMatch, hasPasswordLength, hasPasswordNumber,
            hasPasswordLowercase, hasPasswordUppercase, hasPasswordSymbol];

        let validationClassNames = passwordValidationArray.map(isValid => {
            if (isValid)
                return "valid";
            else
                return "invalid";
        });

        return (
            <div>
                <p className={ validationClassNames[0] }>Passwords Match</p>
                <p className={ validationClassNames[1] }>Minimum of 8 Characters</p>
                <p className={ validationClassNames[2] }>Number</p>
                <p className={ validationClassNames[3] }>Lowercase Letter</p>
                <p className={ validationClassNames[4] }>Uppercase Letter</p>
                <p className={ validationClassNames[5] }>Symbol (?!@#$%^&*)</p>
            </div>
        );
    }
}