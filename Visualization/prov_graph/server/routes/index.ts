import { IRouter } from '../../../../src/core/server';
import { registerGetNodesRoute } from './get_nodes_data';
import { registerGetEdgesRoute } from './get_edges_data';
import { registerGetGrowedNodesRoute } from './get_growed_nodes_data';
import { registerGetGrowedEdgesRoute } from './get_growed_edges_data';
import { registerGetMaxSequence } from './get_max_sequence';
import { registerGetMinSequence } from './get_min_sequence';

export function defineRoutes(router: IRouter) {
  registerGetNodesRoute(router);
  registerGetEdgesRoute(router);
  registerGetGrowedNodesRoute(router);
  registerGetGrowedEdgesRoute(router);
  registerGetMaxSequence(router);
  registerGetMinSequence(router);
  // router.get(
  //   {
  //     path: '/api/p_graph/example',
  //     validate: false,
  //   },
  //   async (context, request, response) => {
  //     return response.ok({
  //       body: {
  //         time: new Date().toISOString(),
  //       },
  //     });
  //   }
  // );
}
