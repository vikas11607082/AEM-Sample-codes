package com.adobe.vikas.sample.aem.core.filters;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.engine.EngineConstants;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Component(immediate = true, service = Filter.class, property = {
		Constants.SERVICE_DESCRIPTION + "=Demo to filter incoming requests",
		EngineConstants.SLING_FILTER_SCOPE + "=" + EngineConstants.FILTER_SCOPE_REQUEST,
		Constants.SERVICE_RANKING + "=-1000"

})

public class SlingFilter implements Filter {

	private Logger log = LoggerFactory.getLogger(getClass());
	@Override
	public void init(FilterConfig filterConfig) throws ServletException {

	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

		log.info("Inside do Filter method");
		log.info("casting  servlet reuest into SlingHttpServletRequest");
		final SlingHttpServletRequest slingrequest = (SlingHttpServletRequest) request;

		//get selectors from the request

		String selector = slingrequest.getRequestPathInfo().getSelectorString();

		//get resource path from the request
		String resourcepath = slingrequest.getRequestPathInfo().getResourcePath();

		//continue with further filtreing
		chain.doFilter(request, response);
	}

	@Override
	public void destroy() {


	}

}
