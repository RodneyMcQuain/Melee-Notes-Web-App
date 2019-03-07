import * as React from 'react';

interface PasswordValidationTextProps {
    isPasswordMatch: boolean;
    hasPasswordLength: boolean;
    hasPasswordNumber: boolean;
    hasPasswordLowercase: boolean;
    hasPasswordUppercase: boolean;
    hasPasswordSymbol: boolean;
}

export class PasswordValidationText extends React.Component<PasswordValidationTextProps, {}> {
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