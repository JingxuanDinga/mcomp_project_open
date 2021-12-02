import React, { useEffect, useState } from 'react';

import {
    EuiFieldText,
} from '@elastic/eui';

interface IBehaviorIdFilter {
    behaviorIdSetF: (text: string) => void;
}

export const BehaviorIdFilter: React.FC<IBehaviorIdFilter> = (props) => {

    const [behaviorId, behaviorIdSet] = useState<string>("");

    useEffect(() => {
        props.behaviorIdSetF(behaviorId);
    }, [behaviorId]);

    const onChange = (e: any) => {
        behaviorIdSet(e.target.value);
    }

    return (
        <EuiFieldText
            placeholder="Enter Behavior ID"
            value={behaviorId}
            onChange={e => onChange(e)}
        />
    );

};