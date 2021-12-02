import React, { useEffect, useState } from 'react';

import {
    EuiFieldText,
} from '@elastic/eui';

interface INodeTypeFilter {
    nodeTypeSetF: (text: string) => void;
}

export const NodeTypeFilter: React.FC<INodeTypeFilter> = (props) => {

    const [nodeType, nodeTypeSet] = useState<string>("");

    useEffect(() => {
        props.nodeTypeSetF(nodeType);
    }, [nodeType]);

    const onChange = (e: any) => {
        nodeTypeSet(e.target.value);
    }

    return (
        <EuiFieldText
            placeholder="Enter Node Type"
            value={nodeType}
            onChange={e => onChange(e)}
        />
    );

};