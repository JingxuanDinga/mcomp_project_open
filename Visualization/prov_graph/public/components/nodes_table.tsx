import React, { useEffect, useState } from 'react';
import { intermediateNode } from '../common/changeFields';

import {
    EuiInMemoryTable
} from '@elastic/eui';

interface INodesTable {
    nodes: intermediateNode[],
}

export const NodesTable: React.FC<INodesTable> = (props) => {
    
    const [items, itemsSet] = useState<intermediateNode[]>([]);
    const isLoading = false;

    useEffect(() => {
        itemsSet(props.nodes);
    }, [props.nodes]);

    return(
        <EuiInMemoryTable
            items={items}
            loading={isLoading}
            columns={[
                {
                    field: 'id',
                    name: 'Node ID',
                    truncateText: false,
                },
                {
                    field: 'name',
                    name: 'Node Name',
                    sortable: true,
                    truncateText: false,
                },
                {
                    field: 'type',
                    name: 'Node Type',
                    sortable: true,
                },
                {
                    field: 'args',
                    name: 'Process Args',
                    sortable: true,
                    truncateText: false,
                },
                {
                    field: 'pid',
                    name: 'PID',
                    sortable: true,
                },
                {
                    field: 'ppid',
                    name: 'PPID',
                    sortable: true,
                },
            ]}
            // search={search}
            pagination={true}
            sorting={true}
        />
    );
}