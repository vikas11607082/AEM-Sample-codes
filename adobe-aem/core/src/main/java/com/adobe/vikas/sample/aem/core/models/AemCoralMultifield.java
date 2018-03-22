package com.adobe.vikas.sample.aem.core.models;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Optional;

@Model(adaptables = Resource.class)
public class AemCoralMultifield {

	// Inject the products node under the current node
	@Inject
	@Optional
	public Resource products;

	// No need of a post construct as we don't have anything to modify after the
	// model is constructed
}