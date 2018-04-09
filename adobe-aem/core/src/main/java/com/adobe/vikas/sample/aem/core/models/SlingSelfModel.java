package com.adobe.vikas.sample.aem.core.models;

import java.util.HashMap;
import java.util.Map;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.Self;

@Model(adaptables = SlingHttpServletRequest.class)
public class SlingSelfModel {

	private static Map<String, String> rendered_content = new HashMap<>();

	static {
		rendered_content.put("/suffix1", "/content1");
		rendered_content.put("/suffix2", "/content2");
	}

	@Self
	private SlingHttpServletRequest request;

	public String getContent() {

		return rendered_content.get(request.getRequestPathInfo().getSuffix());
	}

}
