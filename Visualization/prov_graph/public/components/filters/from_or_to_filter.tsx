import React, { useEffect, useState } from 'react';

import {
    EuiFieldText,
} from '@elastic/eui';

interface IFromOrToFilter {
    fromToSetF: (text: string) => void;
}

export const FromOrToFilter: React.FC<IFromOrToFilter> = (props) => {

    const [fromTo, fromToSet] = useState<string>("");

    useEffect(() => {
        props.fromToSetF(fromTo);
    }, [fromTo]);

    const onChange = (e: any) => {
        fromToSet(e.target.value);
    }

    return (
        <EuiFieldText
            placeholder="Enter Node ID (Or)"
            value={fromTo}
            onChange={e => onChange(e)}
        />
    );

};