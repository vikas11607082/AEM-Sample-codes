package com.adobe.vikas.sample.aem.core.models;

import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_EXTENSIONS;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_METHODS;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_RESOURCE_TYPES;
import static org.apache.sling.api.servlets.ServletResolverConstants.SLING_SERVLET_SELECTORS;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.servlets.SlingAllMethodsServlet;
import org.osgi.service.component.annotations.Component;

@Component(service = UserInfoSlingModelServlet.class, property = {
		SLING_SERVLET_RESOURCE_TYPES + "=PATH/TO/RESOURCE",
		SLING_SERVLET_METHODS + "=GET",
		SLING_SERVLET_EXTENSIONS + "=html",
		SLING_SERVLET_SELECTORS + "=NULL"

}

)

public class UserInfoSlingModelServlet extends SlingAllMethodsServlet {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private ResourceResolverFactory prrf;
	private ResourceResolver prr;

	public void doGet(SlingHttpServletRequest req, SlingHttpServletResponse resp) {

		resp.setContentType("text/html");
		try {

			String firstname_slingmodel = null;
			String lastname_slingmodel = null;

			prr = prrf.getAdministrativeResourceResolver(null);
			Resource resource = prr.getResource("path/to/content");

			if (resource != null) {

				//	ValueMap valueMap = resource.adaptTo(ValueMap.class);

				// importing sling model userinfo class and adapt it to resource
				UserInfo instanceOfUserInfo = resource.adaptTo(UserInfo.class);

				//retrieve value 

				firstname_slingmodel = instanceOfUserInfo.getFirstName();
				lastname_slingmodel = instanceOfUserInfo.getLastName();

			}

			resp.getWriter().write("Sling model response with servlet" + firstname_slingmodel + lastname_slingmodel);

		}

		catch (Exception e) {
			e.printStackTrace();
		}

	}
}
