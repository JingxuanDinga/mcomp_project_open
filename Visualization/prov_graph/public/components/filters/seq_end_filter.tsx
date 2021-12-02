import React, { useEffect, useState } from 'react';

import {
    EuiFieldText,
} from '@elastic/eui';

interface ISequenceEndFilter {
    sequenceEndSetF: (text: string) => void;
}

export const SequenceEndFilter: React.FC<ISequenceEndFilter> = (props) => {

    const [sequenceEnd, sequenceEndSet] = useState<string>("");

    useEffect(() => {
        props.sequenceEndSetF(sequenceEnd);
    }, [sequenceEnd]);

    const onChange = (e: any) => {
        sequenceEndSet(e.target.value);
    }

    return (
        <EuiFieldText
            placeholder="End Sequence"
            value={sequenceEnd}
            onChange={e => onChange(e)}
        />
    );

};