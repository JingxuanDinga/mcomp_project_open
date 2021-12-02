import { IRouter } from '../../../../src/core/server';
import { schema } from '@kbn/config-schema';

export function registerGetEdgesRoute(router: IRouter) {
    router.post(
        {
            path: '/api/prov_graph/get_edges_data',
            validate: {
                body: schema.object({
                    // indexPattern: schema.string(),
                    traceName: schema.string(),
                    behaviorId: schema.string(),
                    fromAndTo: schema.string(),
                    fromOrTo: schema.string(),
                    relation: schema.string(),
                    sequenceStart: schema.string(),
                    sequenceEnd: schema.string(),
                    // selectedEdges: schema.arrayOf(schema.string()),
                }),
            },
        },
        async (context, request, response) => {

            const client = context.core.elasticsearch.client.asCurrentUser;

            if (request.body.behaviorId == "" && request.body.fromAndTo == "" && request.body.fromOrTo == "" && request.body.relation == "" && request.body.sequenceStart == "" && request.body.sequenceEnd == ""){
                const { body: result } = await client.search({
                    // index: request.body.selectedIndex,
                    // body: queryBody,
                    index: "behaviors_" + request.body.traceName,
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
                let behaviorId = request.body.behaviorId;
                if (behaviorId == "") behaviorId = "*";
                let fromAndTo = request.body.fromAndTo;
                if (fromAndTo == "") fromAndTo = "*";
                let fromOrTo = request.body.fromOrTo;
                if (fromOrTo == "") fromOrTo = "*";
                let relation = request.body.relation;
                if (relation == "") relation = "*";
                
                // query_string is for regular expressions or wildcards
                const behaviorQuery = {
                    query_string: { 
                        query: behaviorId,
                        fields: [
                          "b_id.keyword",
                        ]
                    } 
                };
                const fromToQuery = {
                    query_string: { 
                        query: fromOrTo,
                        fields: [
                          "n1_id.keyword",
                          "n2_id.keyword"
                        ]
                    } 
                };
                const fromQuery = {
                    query_string: { 
                        query: fromAndTo,
                        fields: [
                          "n1_id.keyword",
                        ]
                    } 
                };
                const toQuery = {
                    query_string: { 
                        query: fromAndTo,
                        fields: [
                          "n2_id.keyword",
                        ]
                    } 
                };
                const relationQuery = {
                    query_string: { 
                        query: relation,
                        fields: [
                          "relation.keyword",
                        ]
                    } 
                };
                
                var queryBody = {};

                if (request.body.sequenceStart == "" || request.body.sequenceEnd == "") {          
                    queryBody = {
                        query: {
                            bool: {
                                must: [
                                    behaviorQuery,
                                    fromToQuery,
                                    fromQuery,
                                    toQuery,
                                    relationQuery,
                                ]
                            }
                        },
                    };
                }
                // For efficient backtracking and forward tracking
                else if (request.body.sequenceStart != "" && request.body.sequenceEnd != "" && request.body.behaviorId == "" && request.body.fromAndTo == "" && request.body.fromOrTo == "" && request.body.relation == ""){
                    queryBody = {
                        query: {
                            bool: {
                                must: [
                                    {
                                        // range is for range query
                                        range: {
                                            "sequence": {
                                                "gte": parseInt(request.body.sequenceStart),
                                                "lte": parseInt(request.body.sequenceEnd),
                                            }
                                        }
                                    },
                                ]
                            }
                        },
                    };
                }
                else {
                    queryBody = {
                        query: {
                            bool: {
                                must: [
                                    behaviorQuery,
                                    fromToQuery,
                                    fromQuery,
                                    toQuery,
                                    relationQuery,
                                    {
                                        range: {
                                            "sequence": {
                                                "gte": parseInt(request.body.sequenceStart),
                                                "lte": parseInt(request.body.sequenceEnd),
                                            }
                                        }
                                    },
                                ]
                            }
                        },
                    };
                }

                const { body: result } = await client.search({
                    // index: request.body.selectedIndex,
                    body: queryBody,
                    index: "behaviors_" + request.body.traceName,
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