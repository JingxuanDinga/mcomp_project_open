import { PluginInitializerContext } from '../../../src/core/server';
import { ProvGraphPlugin } from './plugin';

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new ProvGraphPlugin(initializerContext);
}

export { ProvGraphPluginSetup, ProvGraphPluginStart } from './types';
