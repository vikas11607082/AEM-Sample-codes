package com.adobe.vikas.sample.aem.core.servlets;

import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_EXTENSIONS;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_METHODS;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_SELECTORS;

import java.io.IOException;

import javax.servlet.Servlet;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Activate;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.metatype.annotations.AttributeDefinition;
import org.osgi.service.metatype.annotations.Designate;
import org.osgi.service.metatype.annotations.ObjectClassDefinition;

import com.adobe.vikas.sample.aem.core.service.LoginService;

@Component(

		immediate = true, service = Servlet.class, property = {
				SLING_SERVLET_RESOURCE_TYPES + "=/apps/my/type",
				SLING_SERVLET_METHODS + "=GET",
				SLING_SERVLET_EXTENSIONS + "=html",
				SLING_SERVLET_SELECTORS + "=hello",

		})

@Designate(ocd = LoginServlet.LoginConfig.class)


public class LoginServlet extends SlingAllMethodsServlet  {

	String restString;
	private LoginService loginservice;

	@ObjectClassDefinition(name = "Login Servlet Configuration", description = "The configuration for the Login component.")
	public @interface LoginConfig {

		@AttributeDefinition(name = "Enter URL", description = "This message is displayed on startup of the component.")
		public String rest_url() default "Rest connection Url";

	}

	@Activate
	protected void activate(LoginConfig config) {

		restString = config.rest_url();
	}

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
 
	
	protected void doGET(SlingHttpServletRequest req,SlingHttpServletResponse resp ){
		
		String usernameinservlet = req.getParameter("Username");
		String passwordinservlet = req.getParameter("password");

		try {
			String calltoLoginService = loginservice.LoginAuthentication(usernameinservlet, passwordinservlet, restString);
		
			resp.getWriter().write(calltoLoginService);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}
	
}
