import * as React from 'react';

interface IPopUpProps {
    text: string;
}

interface IPopUpState {
    isVisible: boolean;
}

export const PopUp = (props: IPopUpProps) => <div className="pop-up">{ props.text }</div>;