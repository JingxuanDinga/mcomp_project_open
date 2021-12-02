import { IRouter } from '../../../../src/core/server';
import { schema } from '@kbn/config-schema';

export function registerGetGrowedNodesRoute(router: IRouter) {
    router.post(
        {
            path: '/api/prov_graph/get_growed_nodes_data',
            validate: {
                body: schema.object({
                    // indexPattern: schema.string(),
                    traceName: schema.string(),
                    nodeName: schema.string(),
                    constNodeName: schema.string(),
                    nodeType: schema.string(),
                    connectedNodes: schema.string(),
                    // selectedNodes: schema.arrayOf(schema.string()),
                }),
            },
        },
        async (context, request, response) => {

            const client = context.core.elasticsearch.client.asCurrentUser;

            let nodeName = request.body.nodeName;
            if (nodeName == "") nodeName = "*";
            let constNodeName = request.body.constNodeName;
            if (constNodeName == "") constNodeName = "*";
            let nodeType = request.body.nodeType;
            if (nodeType == "") nodeType = "*";
            
            var queryBody = {};

            // connectedNodes cannot be "" (empty string)
            if (request.body.nodeName == "" && request.body.constNodeName == "" && request.body.nodeType == "") {
                queryBody = {
                    query: {
                        bool: {
                            must: [
                                {
                                    query_string: { 
                                        query: request.body.connectedNodes,
                                        fields: [
                                          "n_id.keyword"
                                        ]
                                    } 
                                },
                            ]
                        }
                    }
                }
            }
            // The nodes in original query and the growed nodes are all queried
            else {           
                queryBody = {
                    query: {
                        bool: {
                            should: [
                                {
                                    bool: {
                                        must: [
                                            {
                                                query_string: {
                                                    query: nodeName,
                                                    fields: [
                                                        "proc.exe.keyword",
                                                        "file.name.keyword",
                                                        "socket.name.keyword"
                                                    ]
                                                }
                                            },
                                            {
                                                query_string: {
                                                    query: constNodeName,
                                                    fields: [
                                                        "proc.exe.keyword",
                                                        "file.name.keyword",
                                                        "socket.name.keyword"
                                                    ]
                                                }
                                            },
                                            {
                                                query_string: {
                                                    query: nodeType,
                                                    fields: [
                                                        "n_type.keyword",
                                                    ]
                                                }
                                            }
                                        ]
                                    },
                                },
                                {
                                    bool: {
                                        must: [
                                            {
                                                // the constNodeName query is also applicable when growing nodes
                                                query_string: {
                                                    query: constNodeName,
                                                    fields: [
                                                        "proc.exe.keyword",
                                                        "file.name.keyword",
                                                        "socket.name.keyword"
                                                    ]
                                                }
                                            },
                                            {
                                                query_string: { 
                                                    query: request.body.connectedNodes,
                                                    fields: [
                                                        "n_id.keyword"
                                                    ]
                                                } 
                                            },
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                };
            }

            const { body: result } = await client.search({
                // index: request.body.selectedIndex,
                body: queryBody,
                index: "nodes_" + request.body.traceName,
                size: 10000
            });

            const reply = result.hits.hits;

            return response.ok({
                body: {
                    reply,
                },
            });
        }
    );
}