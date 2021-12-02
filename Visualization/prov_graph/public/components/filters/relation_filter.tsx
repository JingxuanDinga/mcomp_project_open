import React, { useEffect, useState } from 'react';

import {
    EuiFieldText,
} from '@elastic/eui';

interface IRelationFilter {
    relationSetF: (text: string) => void;
}

export const RelationFilter: React.FC<IRelationFilter> = (props) => {

    const [relation, relationSet] = useState<string>("");

    useEffect(() => {
        props.relationSetF(relation);
    }, [relation]);

    const onChange = (e: any) => {
        relationSet(e.target.value);
    }

    return (
        <EuiFieldText
            placeholder="Enter Relation"
            value={relation}
            onChange={e => onChange(e)}
        />
    );

};