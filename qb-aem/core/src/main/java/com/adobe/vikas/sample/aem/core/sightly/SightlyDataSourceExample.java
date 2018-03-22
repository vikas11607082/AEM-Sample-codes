package com.adobe.vikas.sample.aem.core.sightly;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceMetadata;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.api.wrappers.ValueMapDecorator;

import com.adobe.cq.sightly.WCMUsePojo;
import com.adobe.granite.ui.components.ds.DataSource;
import com.adobe.granite.ui.components.ds.SimpleDataSource;
import com.adobe.granite.ui.components.ds.ValueMapResource;

/**
 * Sightly class act as a data source returning dynamic data.
 * 
 * @author Praveen
 */
public class SightlyDataSourceExample extends WCMUsePojo {
	@Override
	public void activate() throws Exception {
		ResourceResolver resolver = getResource().getResourceResolver();

		// Create an ArrayList to hold data
		List<Resource> resourceList = new ArrayList<Resource>();

		ValueMap vm = null;

		for (int i = 1; i <= 4; i++) {
			vm = new ValueMapDecorator(new HashMap<String, Object>());
			String Value = "samplevalue" + i;
			String Text = "Sample Text " + i;
			vm.put("value", Value);
			vm.put("text", Text);

			resourceList.add(new ValueMapResource(resolver,
					new ResourceMetadata(), "nt:unstructured", vm));
		}

		// Create a DataSource that is used to populate the drop-down control
		DataSource ds = new SimpleDataSource(resourceList.iterator());
		this.getRequest().setAttribute(DataSource.class.getName(), ds);
	}
}