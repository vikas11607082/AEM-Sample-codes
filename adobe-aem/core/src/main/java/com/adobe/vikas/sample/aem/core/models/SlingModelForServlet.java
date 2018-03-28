package com.adobe.vikas.sample.aem.core.models;

import java.util.ArrayList;

/*Vikas11607082*/

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.inject.Inject;
import javax.jcr.RepositoryException;
import javax.jcr.Session;
import javax.jcr.UnsupportedRepositoryOperationException;

import org.apache.jackrabbit.api.security.JackrabbitAccessControlManager;
import org.apache.jackrabbit.api.security.user.User;
import org.apache.jackrabbit.api.security.user.UserManager;

/* Component will accept two inputs from author, one being title of component and other 
 * being path from where it has to read pages. 
 * Let’s say the path you have give is /content/geometrixx-media/en 
 * now it will select all pages having node type as cq:Page . 
 * Type of query you want to perform can be easily changed. 
 * Now based on the search result it gets, paginations will be created on page. 
 * It uses selector based approach, once you click next page or any number you can notice selector will be added on URL
 * */

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.LoginException;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;

import com.day.cq.search.PredicateGroup;
import com.day.cq.search.Query;
import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.SearchResult;

@Model(adaptables=SlingHttpServletRequest.class)
public class SlingModelForServlet {

@Inject 
	private String path;

	@Inject
	private QueryBuilder querybuilder;

	@SlingObject
	private ResourceResolverFactory resourceResolverFactory;
	private ResourceResolver resourceResolver;
	private Resource resource;

	@Inject
	private Logger logger;

	@Inject
	private SlingHttpServletRequest slinghttprequest;

	@Inject
	private Session session;

	@PostConstruct
	public void init() {
	
		logger.info("Inside SlingModelForServlet init method ");

		getValueFromServlet();
		searchByPath(path);

	}

	private void getValueFromServlet() {

		try {
			resourceResolver = resourceResolverFactory.getResourceResolver(null);
			resource = resourceResolver.getResource(path);

			ValueMap valuemapdata = resource.adaptTo(ValueMap.class);
			String path = valuemapdata.get("path", String.class);
			String title = valuemapdata.get("title", String.class);

			/* Adpating the resource from the request */
			Resource resource_request = slinghttprequest.getResource().getResourceResolver().adaptTo(Resource.class);

			/* Adapting into valuemap object */

			ValueMap valueMapFromServlet = resource_request.adaptTo(ValueMap.class);

			String title_req = valuemapdata.get("title", String.class);
			String path_req = valuemapdata.get("path", String.class);

		} catch (LoginException e) {
			e.printStackTrace();
		}


		//Resource resource = slinghttprequest.getResourceResolver().adaptTo(Resource.class);

		//	Node node=resource.adaptTo(Node.class);

		ValueMap valuemap = resource.adaptTo(ValueMap.class);

		// String title = valuemap.

		//ValueMap node = slinghttprequest.getResource().getValueMap();

		//	get("title", String.class);
		//String path = node.get("path", String.class);

	}

	private List<SearchResult> searchByPath(String path) {

		Map<String, String> querymap = new HashMap<String, String>();
		querymap.put("path", "/content");

		querymap.put("type", "cq:Page");
		querymap.put("group.p.or", "true"); // combine this group with OR
		querymap.put("group.1_fulltext", path);
		querymap.put("group.1_fulltext.relPath", "jcr:content");

		querymap.put("p.offset", "0"); // same as query.setStart(0) below
		querymap.put("p.limit", "20"); // same as query.setHitsPerPage(20) below

		Query query = querybuilder.createQuery(PredicateGroup.create(querymap), session);

		SearchResult result = query.getResult();

		// paging metadata
		int hitsPerPage = result.getHits().size(); // 20 (set above) or lower
		long totalMatches = result.getTotalMatches();
		long offset = result.getStartIndex();
		long numberOfPages = totalMatches / 20;

		List listresult = new ArrayList();

		listresult.add(result);
		return listresult;

	}

	private String getAuthorization(String path){
		


		try {

			Session session = slinghttprequest.getResource().getResourceResolver().adaptTo(Session.class);

			/* */
			JackrabbitAccessControlManager jACL = (JackrabbitAccessControlManager) session;
			UserManager usermanager = slinghttprequest.adaptTo(UserManager.class);
			User user = (User) usermanager.getAuthorizable(session.getUserID());
			String userid = user.getID();

			HashMap authinfo = new HashMap<>();
			authinfo.put("userid", userid);
			authinfo.put("password", userid);

			//		Authorizable auth=usermanager.getAuthorizableByPath(path);
			//			String userid = usermanager.getAuthorizableByPath(path).getPrincipal().getName().toString();

			//Set<Principal> principals = new HashSet<Principal>();
			//principals.add(auth.getPrincipal());
 
			//javax.jcr.security.Privilege[] privilege = jACL.getPrivileges(path, principals);
			/*
			 * for (Privilege p : privilege) {
			 * 
			 * logger.info("**** Here are the permissions: group: " + auth.getID() + " privilege: " + p.getName());
			 * 
			 * if (user.equals("admin")) {
			 * 
			 * String fullrights = p.JCR_ALL;
			 * // String username=p.getName();
			 * }
			 * 
			 * else {
			 * 
			 * //String group = auth.getID();
			 * String userrights = p.JCR_MODIFY_PROPERTIES;
			 * 
			 * }
			 * }
			 */
		} catch (UnsupportedRepositoryOperationException e) {
			logger.error("Unsupported Exception" + e);
		} catch (RepositoryException e) {
			logger.error("Repository Exception" + e);
		}
         
		
		return null;
		
		
	}

}
