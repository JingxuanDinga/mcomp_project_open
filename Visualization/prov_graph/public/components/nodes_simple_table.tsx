import React, { useEffect, useState } from 'react';

import {
    EuiInMemoryTable
} from '@elastic/eui';

interface INodesSimpleTable {
    nodes: any[],
}

export const NodesSimpleTable: React.FC<INodesSimpleTable> = (props) => {

    const [items, itemsSet] = useState<any[]>([]);
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
                    field: 'label',
                    name: 'Node Name',
                    sortable: true,
                    truncateText: false,
                },
                {
                    field: 'group',
                    name: 'Node Type',
                    sortable: true,
                },
                {
                    field: 'description',
                    name: 'Process Args',
                    sortable: true,
                    truncateText: false,
                },
            ]}
            // search={search}
            pagination={true}
            sorting={true}
        />
    );
}