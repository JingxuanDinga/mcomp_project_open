import React, { useEffect, useState } from 'react';

import {
    EuiFieldText,
} from '@elastic/eui';

interface INodeNameFilter {
    nodeNameSetF: (text: string) => void;
}

export const ConstNodeNameFilter: React.FC<INodeNameFilter> = (props) => {

    const [nodeName, nodeNameSet] = useState<string>("");

    useEffect(() => {
        props.nodeNameSetF(nodeName);
    }, [nodeName]);

    const onChange = (e: any) => {
        nodeNameSet(e.target.value);
    }

    return (
        <EuiFieldText
            placeholder="Node Name Filter not affected by Graph Growing"
            value={nodeName}
            onChange={e => onChange(e)}
        />
    );

};