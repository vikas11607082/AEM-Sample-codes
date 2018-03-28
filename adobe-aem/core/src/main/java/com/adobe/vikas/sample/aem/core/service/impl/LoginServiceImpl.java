package com.adobe.vikas.sample.aem.core.service.impl;

import java.io.IOException;

import org.apache.http.HttpResponse;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.HttpClientBuilder;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;

import com.adobe.vikas.sample.aem.core.service.LoginService;



@Component(immediate = true, service = LoginService.class, property = {
		Constants.SERVICE_DESCRIPTION + "=Sample login service",
		Constants.SERVICE_VENDOR + "=Vikash kumar"

}

)
public class LoginServiceImpl implements LoginService {


	@Override
	public String LoginAuthentication(String username, String password, String restString) {

		HttpResponse response = null;

		String param = "/SOME/REST/URL/" + username + "&&" + password;
		try {
			String restURL = restString;
		HttpClient httpclient = HttpClientBuilder.create().build();
			HttpGet httpGet = new HttpGet(restURL + param);
	    		
  		httpGet.addHeader("COMPANY", "DEMO");
        httpGet.addHeader("SENDER", "DEMO");
        httpGet.addHeader("RECEIVER", "DEMO");
        httpGet.addHeader("IFID", "DEMO");
        httpGet.addHeader("Authorization", "DEMO");

			response = httpclient.execute(httpGet);
		} catch (ClientProtocolException e) {
			e.printStackTrace();		} 
		catch (IOException e) {
			e.printStackTrace();
		}
		return response.toString();
	}

}
