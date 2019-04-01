import * as React from 'react';

interface SetRatioProps {
    setsWon: number;
    setsLost: number;
}

export const SetRatio = (props: SetRatioProps) => (
    <div className="col-xs-12">
        Set Count: { props.setsWon }-{ props.setsLost } (excludes character in query)
    </div>
);