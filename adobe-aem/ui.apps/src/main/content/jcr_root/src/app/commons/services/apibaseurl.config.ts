import {InjectionToken} from '@angular/core';
import {environment} from '../../../environments/environment'

/**
 * In the AEM integration we need to be able to configure the base url for our rest api calls. The page will be
 * loaded from a different domain than the rest api is hosted. In the AEM Application Integration Component we're
 * defining the apiBaseUrl. It will create the following html snippet:<br>
 *
 *  <app-root
 *      contextConfiguration="{&quot;language&quot;:&quot;en&quot;,&quot;country&quot;:&quot;US&quot;,&quot;path&quot;:&quot;/content/onemarketing/azcddp/oe1-ref-portal/en_GB/quote-buy/QB2&quot;}"
 *      customConfiguration="{&quot;apiBaseUrl&quot;:&quot;https://pl-qb-sit.apps.adp.allianz//&quot;}"
 *      caasContent=""
 *   i18n="{}"></app-root>
 *
 * This factory is parsing the <em>customConfiguration</em> and getting the <em>apiBaseUrl</em> out of it.
 *
 * @returns {string} the api base url or null if none has been configured
 * @constructor
 */
export const ApiBaseUrlFactory = () => {
  const appRootElements = window.document.getElementsByTagName('app-root');
  let apiBaseUrl: string = null;
  if (appRootElements.length > 0) {
    const customConfigAttr = appRootElements[0].getAttribute('customConfiguration');
    if (customConfigAttr) {
      const customConfig = JSON.parse(customConfigAttr);
      apiBaseUrl = customConfig['apiBaseUrl']
    }
  } 
  if (!apiBaseUrl && environment.dispatcherBaseUrl) {
    apiBaseUrl = environment.dispatcherBaseUrl;
  }

  if (apiBaseUrl) {
    console.log('custom configuration for API_BASE_URL: \'' + apiBaseUrl + '\'');
  }
  return apiBaseUrl;
};

/**
 * Inject the configured rest api base url like this into your component or service
 *
 * constructor(@Optional() @Inject(API_BASE_URL) apiBaseUrl?: string) {
 * ... }
 *
 * @type {InjectionToken<string>}
 */
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

