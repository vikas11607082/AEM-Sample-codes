package com.adobe.vikas.sample.aem.core.models;

import javax.annotation.PostConstruct;
import javax.inject.Inject;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.apache.sling.api.resource.ValueMap;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.Via;
import org.apache.sling.models.annotations.injectorspecific.SlingObject;
import org.slf4j.Logger;

@Model(adaptables = SlingHttpServletRequest.class)
public class ContactListModel {

	@Inject
	private SlingHttpServletRequest request;

	@Inject
	private String fname;
	@Inject
	private String lname;
	@Inject
	private String email;
	
	@Inject
	private Logger log;
	@SlingObject
	private ResourceResolverFactory rrf;

	@Inject
	@Via("resource")
	private ContactListModel contacts;

	public String getFname() {
		return fname;
	}

	public void setFname(String fname) {
		this.fname = fname;
	}

	public String getLname() {
		return lname;
	}

	public void setLname(String lname) {
		this.lname = lname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public ContactListModel getContacts() {
		return contacts;
	}

	public void setContacts(ContactListModel contacts) {
		this.contacts = contacts;
	}

	
	@PostConstruct
	public void init(){
		log.info("Inside Sling model init method");
		try {

			Resource resource = request.getResource();

			ValueMap valuemapdata = resource.adaptTo(ValueMap.class);

			ContactListModel clm = new ContactListModel();

			clm.setFname(valuemapdata.get("fname", String.class));
			clm.setLname(valuemapdata.get("lname", String.class));
			clm.setEmail(valuemapdata.get("email", String.class));

			setContacts(clm);
		}
		catch(Exception e){
			log.error("Exception e" + e);
		}
		
	}
}
