/* AEM includes the org.apache.sling.commons.log bundle with an implementation of SLF4J. 
 * The SLF4J framework allows you to interact with the logging system in AEM. 
 * You can easily acquire a SLF4J Logger instance in your own class via the LoggerFactory:
 */

package com.adobe.vikas.sample.aem.core.LoggingFramworkExample;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class LoggingInstance {

	public void testLogger() {

		Logger log = LoggerFactory.getLogger(this.getClass());

		log.info("Logger Info Initialized");

		log.warn("Logger Warn initialized");

		log.debug("logger Debug mode initialized");

		log.error("Logger warn initalized");

	}
}
