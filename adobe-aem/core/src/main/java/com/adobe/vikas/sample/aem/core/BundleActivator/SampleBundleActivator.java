package com.adobe.vikas.sample.aem.core.BundleActivator;

import java.util.Dictionary;
import java.util.Hashtable;

import org.osgi.framework.BundleActivator;
import org.osgi.framework.BundleContext;
import org.osgi.framework.Constants;
import org.osgi.framework.ServiceReference;
import org.osgi.service.component.annotations.Reference;

import com.adobe.vikas.sample.aem.core.service.LoginService;
import com.adobe.vikas.sample.aem.core.service.impl.LoginServiceImpl;

public class SampleBundleActivator implements BundleActivator{

	@Reference
	private LoginService loginservice;
	@Override
	public void start(BundleContext context) throws Exception {
		
		//Bundle context object is being used for following 
		final Dictionary<String, String> properties = new Hashtable<String, String>();
		properties.put(Constants.SERVICE_DESCRIPTION, "A bundle activator service");
		context.registerService(LoginService.class, new LoginServiceImpl(), properties);
		//how to access the registered service

	}

	@SuppressWarnings("unchecked")
	@Override
	public void stop(BundleContext context) throws Exception {
		
		context.ungetService((ServiceReference<LoginService>) new LoginServiceImpl());

	}

}
