import React, { useEffect, useState } from 'react';

import {
    EuiFieldText,
} from '@elastic/eui';

interface ISequenceStartFilter {
    sequenceStartSetF: (text: string) => void;
}

export const SequenceStartFilter: React.FC<ISequenceStartFilter> = (props) => {

    const [sequenceStart, sequenceStartSet] = useState<string>("");

    useEffect(() => {
        props.sequenceStartSetF(sequenceStart);
    }, [sequenceStart]);

    const onChange = (e: any) => {
        sequenceStartSet(e.target.value);
    }

    return (
        <EuiFieldText
            placeholder="Start Sequence"
            value={sequenceStart}
            onChange={e => onChange(e)}
        />
    );

};