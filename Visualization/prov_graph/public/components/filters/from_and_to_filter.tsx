import React, { useEffect, useState } from 'react';

import {
    EuiFieldText,
} from '@elastic/eui';

interface IFromAndToFilter {
    fromToSetF: (text: string) => void;
}

export const FromAndToFilter: React.FC<IFromAndToFilter> = (props) => {

    const [fromTo, fromToSet] = useState<string>("");

    useEffect(() => {
        props.fromToSetF(fromTo);
    }, [fromTo]);

    const onChange = (e: any) => {
        fromToSet(e.target.value);
    }

    return (
        <EuiFieldText
            placeholder="Enter Node ID (And)"
            value={fromTo}
            onChange={e => onChange(e)}
        />
    );

};