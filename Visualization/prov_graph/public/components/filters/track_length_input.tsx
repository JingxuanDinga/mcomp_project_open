import React, { useEffect, useState } from 'react';

import {
    EuiFieldText,
} from '@elastic/eui';

interface ITrackLengthInput {
    trackLengthSetF: (text: string) => void;
}

export const TrackLengthInput: React.FC<ITrackLengthInput> = (props) => {

    const [trackLength, trackLengthSet] = useState<string>("1000");

    useEffect(() => {
        props.trackLengthSetF(trackLength);
    }, [trackLength]);

    const onChange = (e: any) => {
        trackLengthSet(e.target.value);
    }

    return (
        <EuiFieldText
            placeholder="Enter Tracking Length"
            value={trackLength}
            onChange={e => onChange(e)}
        />
    );

};