import React, { useEffect, useState } from 'react';

import {
    EuiFieldText,
} from '@elastic/eui';

interface ITraceFilter {
    traceNameSetF: (text: string) => void;
}

export const TraceFilter: React.FC<ITraceFilter> = (props) => {

    const [traceName, traceNameSet] = useState<string>("");

    useEffect(() => {
        props.traceNameSetF(traceName);
    }, [traceName]);

    const onChange = (e: any) => {
        traceNameSet(e.target.value);
    }

    return (
        <EuiFieldText
            placeholder="Enter Trace Name"
            value={traceName}
            onChange={e => onChange(e)}
        />
    );

};