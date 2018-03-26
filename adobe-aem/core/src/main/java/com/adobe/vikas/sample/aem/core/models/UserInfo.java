package com.adobe.vikas.sample.aem.core.models;

import javax.inject.Inject;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;

@Model(adaptables = Resource.class)
public class UserInfo {

	@Inject
	private String firstname;

	@Inject
	private String lastname;

	//	 the @Model annotation is used. 
	//Likewise, each data member in the UserInfo class is annotated using @Inject. 
	//This Java class is mapped to a Sling resource, like the one shown in the following illustatration. 

	public String getFirstName() {
		return firstname;
	}

	public String getLastName() {
		return lastname;
	}

}
