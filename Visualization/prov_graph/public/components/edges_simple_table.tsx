import React, { useEffect, useState } from 'react';

import {
    EuiInMemoryTable
} from '@elastic/eui';

interface IEdgesSimpleTable {
    edges: any[],
}

export const EdgesSimpleTable: React.FC<IEdgesSimpleTable> = (props) => {

    const [items, itemsSet] = useState<any[]>([]);
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
                    field: 'label',
                    name: 'Sequence: Relation',
                    sortable: true,
                },
                {
                    field: 'description',
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