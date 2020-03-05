import * as React from 'react';

interface EmailValidationTextProps {
    isEmailNotEmpty: boolean;
    isEmailValid: boolean;
    isEmailDuplicate: boolean;
    setArrayValidity: Function;
}

export const EmailValidationText = (props: EmailValidationTextProps) => {
    const { isEmailNotEmpty, isEmailValid, isEmailDuplicate } = props;

    let emailValidationArray = [isEmailNotEmpty, isEmailValid, isEmailDuplicate];

    const validationClassNames = props.setArrayValidity(emailValidationArray);

    return (
        <>
            <p className={ validationClassNames[0] }>Email is not empty</p>
            <p className={ validationClassNames[1] }>Email is valid</p>
            <p className={ validationClassNames[2] }>Email is available</p>
        </>
    );
};