import { IRouter } from '../../../../src/core/server';
import { schema } from '@kbn/config-schema';

export function registerGetNodesRoute(router: IRouter) {
    router.post(
        {
            path: '/api/prov_graph/get_nodes_data',
            validate: {
                body: schema.object({
                    // indexPattern: schema.string(),
                    traceName: schema.string(),
                    nodeName: schema.string(),
                    constNodeName: schema.string(),
                    nodeType: schema.string(),
                    // selectedNodes: schema.arrayOf(schema.string()),
                }),
            },
        },
        async (context, request, response) => {

            const client = context.core.elasticsearch.client.asCurrentUser;

            if (request.body.nodeName == "" && request.body.constNodeName == "" && request.body.nodeType == "") {
                const { body: result } = await client.search({
                    // index: request.body.selectedIndex,
                    // body: queryBody,
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
            else {
                // TODO: do not use wildcard to optimize the query
                let nodeName = request.body.nodeName;
                if (nodeName == "") nodeName = "*";
                let constNodeName = request.body.constNodeName;
                if (constNodeName == "") constNodeName = "*";
                let nodeType = request.body.nodeType;
                if (nodeType == "") nodeType = "*";
                const queryBody = {
                    query: {
                        bool: {
                            must: [
                                {
                                    // for regular expression
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
                                    // for regular expression
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
                                    // for regular expression
                                    query_string: { 
                                        query: nodeType,
                                        fields: [
                                          "n_type.keyword",
                                        ]
                                    }
                                }
                            ]
                        }
                    },
                };
                
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
        }
    );
}