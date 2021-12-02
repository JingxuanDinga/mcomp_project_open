import React, { useEffect, useState } from 'react';
import { intermediateEdge } from '../common/changeFields';

import {
    EuiInMemoryTable
} from '@elastic/eui';

interface IEdgesTable {
    edges: intermediateEdge[],
}

export const EdgesTable: React.FC<IEdgesTable> = (props) => {

    const [items, itemsSet] = useState<intermediateEdge[]>([]);

    const isLoading = false;

    useEffect(() => {
        itemsSet(props.edges);
    }, [props.edges]);

    return(
        <EuiInMemoryTable
            items={items}
            loading={isLoading}
            columns={[
                {
                    field: 'id',
                    name: 'Edge ID',
                    truncateText: false,
                },
                {
                    field: 'from',
                    name: 'From',
                    sortable: true,
                },
                {
                    field: 'to',
                    name: 'To',
                    sortable: true,
                },
                {
                    field: 'relation',
                    name: 'Relation',
                    sortable: true,
                },
                {
                    field: 'sequence',
                    name: 'Sequence',
                    sortable: true,
                },
                {
                    field: 'timestamp',
                    name: 'Timestamp',
                    sortable: true,
                },
                {
                    field: 'behavior',
                    name: 'Behavior ID',
                    sortable: true,
                },
            ]}
            // search={search}
            pagination={true}
            sorting={true}
        />
    );
}