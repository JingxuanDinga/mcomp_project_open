import './index.scss';

import { ProvGraphPlugin } from './plugin';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin() {
  return new ProvGraphPlugin();
}
export { ProvGraphPluginSetup, ProvGraphPluginStart } from './types';
