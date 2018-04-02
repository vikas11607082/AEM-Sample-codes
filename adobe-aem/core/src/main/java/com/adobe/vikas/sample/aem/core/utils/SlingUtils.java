package com.adobe.vikas.sample.aem.core.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.day.cq.wcm.api.WCMMode;

public class SlingUtils {
		
	private SlingUtils() {
	    // Private constructor because this is an util class.
	  }

	 /**
	   *
	   * @param resourcePath The resource path to resolve. Use any selectors or extension.
	   * @param extension Use any selector and extension. E.g. "caas.json" or ".html"
	   * @param resourceResolver Current resourceResolver
	   * @param requestProcessor Current requestProcessor
	   * @param requestResponseFactory Current requestResponseFactory
	   * @return the (server side) rendered content of the resource. E.g. HTML or JSON. If the resource does not exist an empty string
	   *         is returned instead.
	   * @throws PlatformException
	   */
	  public static String processRequestContentByPath(String resourcePath, String extension, org.apache.sling.api.resource.ResourceResolver resourceResolver,
			org.apache.sling.engine.SlingRequestProcessor requestProcessor,
			com.day.cq.contentsync.handler.util.RequestResponseFactory requestResponseFactory) {
	    org.apache.sling.api.resource.Resource resource = resourceResolver.getResource(resourcePath);
	    if (resource == null) {
	      return "";
	    }

	    String requestPath = resourcePath + extension;

	    // Setup request
	    HttpServletRequest req = requestResponseFactory.createRequest("GET", requestPath);
	    		
	    WCMMode.DISABLED.toRequest(req);

	    // Setup response
	    ByteArrayOutputStream out = new ByteArrayOutputStream();
		HttpServletResponse resp = requestResponseFactory.createResponse(out);

	    // Process request through Sling
	    try {
	      requestProcessor.processRequest(req, resp, resourceResolver);
	    }
	    catch (ServletException | IOException e) {
			e.printStackTrace();
	    }

	    return out.toString();
	  }











}
