import { IRouter } from '../../../../src/core/server';
import { schema } from '@kbn/config-schema';

export function registerGetMaxSequence(router: IRouter) {
    router.post(
        {
            path: '/api/prov_graph/get_max_sequence',
            validate: {
                body: schema.object({
                    // indexPattern: schema.string(),
                    traceName: schema.string(),
                    to: schema.string(),
                    sequenceStart: schema.string(),
                    sequenceEnd: schema.string(),
                    // selectedEdges: schema.arrayOf(schema.string()),
                }),
            },
        },
        async (context, request, response) => {

            const client = context.core.elasticsearch.client.asCurrentUser;
   
            var queryBody = {};

            if (request.body.sequenceStart == "" || request.body.sequenceEnd == "") {          
                queryBody = {
                    query: {
                        bool: {
                            must: [
                                {
                                    query_string: { 
                                        query: request.body.to,
                                        fields: [
                                            "n2_id.keyword"
                                        ]
                                    } 
                                },
                            ]
                        }
                    },
                    aggs: {
                        "max_sequence": { 
                            "max": { 
                                "field": "sequence" 
                            } 
                        }
                    },
                };
            }
            else {
                queryBody = {
                    query: {
                        bool: {
                            must: [
                                {
                                    query_string: { 
                                        query: request.body.to,
                                        fields: [
                                            "n2_id.keyword"
                                        ]
                                    } 
                                },
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
                    aggs: {
                        "max_sequence": { 
                            "max": { 
                                "field": "sequence" 
                            } 
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

            const reply = result;

            return response.ok({
                body: {
                    reply,
                },
            });
        }
    );
}