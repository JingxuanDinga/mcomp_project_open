import { NavigationPublicPluginStart } from '../../../src/plugins/navigation/public';
import { DataPublicPluginStart } from '../../../src/plugins/data/public';

export interface ProvGraphPluginSetup {
  getGreeting: () => string;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface ProvGraphPluginStart {}

export interface AppPluginStartDependencies {
  navigation: NavigationPublicPluginStart;
  data: DataPublicPluginStart;
}
