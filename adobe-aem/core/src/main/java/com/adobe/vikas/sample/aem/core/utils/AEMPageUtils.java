package com.adobe.vikas.sample.aem.core.utils;

import org.json.JSONObject;

import com.day.cq.wcm.api.Template;

public interface AEMPageUtils {

	public JSONObject getParentPageWithTemplate(String path, Template requiredTemplate);
}
