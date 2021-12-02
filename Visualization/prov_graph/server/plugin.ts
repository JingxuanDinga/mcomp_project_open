import {
  PluginInitializerContext,
  CoreSetup,
  CoreStart,
  Plugin,
  Logger,
} from '../../../src/core/server';

import { ProvGraphPluginSetup, ProvGraphPluginStart } from './types';
import { defineRoutes } from './routes';

export class ProvGraphPlugin implements Plugin<ProvGraphPluginSetup, ProvGraphPluginStart> {
  private readonly logger: Logger;

  constructor(initializerContext: PluginInitializerContext) {
    this.logger = initializerContext.logger.get();
  }

  public setup(core: CoreSetup) {
    this.logger.debug('ProvGraph: Setup');
    const router = core.http.createRouter();

    // Register server side APIs
    defineRoutes(router);

    return {};
  }

  public start(core: CoreStart) {
    this.logger.debug('ProvGraph: Started');
    return {};
  }

  public stop() {}
}
