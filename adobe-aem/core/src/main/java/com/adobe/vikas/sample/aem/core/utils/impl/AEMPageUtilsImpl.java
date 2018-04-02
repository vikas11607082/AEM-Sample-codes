package com.adobe.vikas.sample.aem.core.utils.impl;

import org.apache.sling.api.resource.ResourceResolverFactory;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.vikas.sample.aem.core.utils.AEMPageUtils;
import com.day.cq.wcm.api.Page;
import com.day.cq.wcm.api.PageManager;
import com.day.cq.wcm.api.Template;

public class AEMPageUtilsImpl implements AEMPageUtils {

	Logger log = LoggerFactory.getLogger(AEMPageUtilsImpl.class);

	JSONObject jObj = new JSONObject();

	String jSONString;
	private PageManager pageManager;
	private ResourceResolverFactory rrf;

	@Override
	public JSONObject getParentPageWithTemplate(String path, Template requiredTemplate) {
		try {
			Page page = pageManager.getContainingPage(rrf.getResourceResolver(null).getResource(path));

			String page_title = page.getTitle();
			String page_Name = page.getName();
			String current_page_template_name = page.getTemplate().getTitle();
			String parent_page = page.getParent().getName();

			jObj.put("jcr:title", page_title);
			jObj.put("cq:page", parent_page);
			jObj.put("cq:template", current_page_template_name);
			jObj.put("jcr:name", page_Name);

		} catch (Exception e) {
			log.error("Exception error trace " + e);
		}

		return jObj;
	}



}
