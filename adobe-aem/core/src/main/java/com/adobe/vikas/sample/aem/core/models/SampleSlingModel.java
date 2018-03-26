package com.adobe.vikas.sample.aem.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Named;
import javax.jcr.Node;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.ValueFormatException;
import javax.jcr.lock.LockException;
import javax.jcr.nodetype.ConstraintViolationException;
import javax.jcr.version.VersionException;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.models.annotations.DefaultInjectionStrategy;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Required;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.Self;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;

@Model(adaptables = SlingHttpServletRequest.class, defaultInjectionStrategy = DefaultInjectionStrategy.OPTIONAL)

public class SampleSlingModel {

	String ModifiedPageTitle;

	@Self
	private SlingHttpServletRequest slingHttpServletRequest;

	@Self
	@Via("Resource")
	private Resource resource;

	@ValueMapValue
	@Named("jcr:title")
	@Required
	private String title;

	public String getTitle() {
		return ModifiedPageTitle;
	}

	//	public void setTitle(String title) {
	//		this.title = title;
	//	}

	@SlingObject
	private ResourceResolverFactory rrf;
	private Page page;
	private ResourceResolver resourceresolver;
	private Node node;
	//private CurrentPage currentpage;
	// private ResourceResolver resourceresolver;

	@PostConstruct
	private void init() {

		try {
			resourceresolver = rrf.getAdministrativeResourceResolver(null);
			page = resourceresolver.adaptTo(PageManager.class).getContainingPage(resource);

			String ModifiedPageTitle;
			Node currentNode = page.adaptTo(Node.class);

			try {
				Property getPopsPageTitle = currentNode.getProperty("jcr:title");

				if (getPopsPageTitle == null) {
					Property setPropsPageTitle = currentNode.setProperty("jcr:title", title);

					ModifiedPageTitle = setPropsPageTitle.toString();
				}

			} catch (ValueFormatException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (VersionException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (LockException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (ConstraintViolationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (RepositoryException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}

		} catch (LoginException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}

}
