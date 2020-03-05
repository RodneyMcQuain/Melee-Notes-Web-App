import * as React from 'react';

interface UsernameValidationTextProps {
    isUsernameNotEmpty: boolean;
    isUsernameDuplicate: boolean;
    setArrayValidity: Function;
}

export const UsernameValidationText = (props: UsernameValidationTextProps) => {
    const { isUsernameNotEmpty, isUsernameDuplicate} = props;

    let usernameValidationArray = [isUsernameNotEmpty, isUsernameDuplicate];

    const validationClassNames = props.setArrayValidity(usernameValidationArray);

    return (
        <>
            <p className={ validationClassNames[0] }>Username is not empty</p>
            <p className={ validationClassNames[1] }>Username is available</p>
        </>
    );
};