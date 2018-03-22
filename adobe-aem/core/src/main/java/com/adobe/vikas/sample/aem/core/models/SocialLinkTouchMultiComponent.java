package com.adobe.vikas.sample.aem.core.models;


import java.util.ArrayList;
import java.util.List;

import javax.jcr.Node;
import javax.jcr.PathNotFoundException;
import javax.jcr.Property;
import javax.jcr.RepositoryException;
import javax.jcr.Value;
import javax.jcr.ValueFormatException;

import org.apache.sling.commons.json.JSONException;
import org.apache.sling.commons.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.adobe.cq.sightly.WCMUsePojo;



public class SocialLinkTouchMultiComponent
		extends WCMUsePojo {

	/** Default log. */
	protected final Logger log = LoggerFactory.getLogger(this.getClass());

	private SocialLinkTouchMultiBean mBean = null;

	private SocialLinkItemsBean iBean = null;

	private List<SocialLinkItemsBean> lBean = null;

	private List<SocialLinkTouchMultiBean> multiList = null;

	@Override

	public void activate() throws Exception {

		log.info("##### SOCIAL LINK INVOKED ACTIVATE");

		multiList = new ArrayList<SocialLinkTouchMultiBean>();

		Node currentNode = getResource().adaptTo(Node.class);

		String[] tabs = { "i", "u", "uk" };

		for (int i = 0; i < tabs.length; i++) {

			String currentItem = tabs[i] + "Items";

			if (currentNode.hasProperty(currentItem)) {

				log.info("##### SOCIAL LINK COMPONENTS ITEMS ARE BEING SET" + currentItem);
				setItems(currentNode, currentItem);

				if (currentNode.hasProperty(tabs[i] + "Dashboard")) {

					mBean.setDashboard(currentNode.getProperty(tabs[i] + "Dashboard").getString());

				}

				multiList.add(mBean);

			}

		}

	}

	private void setItems(Node currentNode, String tab)

			throws PathNotFoundException, RepositoryException, ValueFormatException, JSONException {

		try {
			Value[] value;

			JSONObject jObj;

			Property currentProperty;

			mBean = new SocialLinkTouchMultiBean();

			lBean = new ArrayList<SocialLinkItemsBean>();

			currentProperty = currentNode.getProperty(tab);

			if (currentProperty.isMultiple()) {

				value = currentProperty.getValues();

			} else {

				value = new Value[1];

				value[0] = currentProperty.getValue();

			}

			for (int i = 0; i < value.length; i++) {

				log.info("Inside data Social link ");

				jObj = new JSONObject(value[i].getString());

				iBean = new SocialLinkItemsBean();

				iBean.setSocialtext(jObj.getString("socialtext"));

				iBean.setSociallink(jObj.getString("sociallink"));
				iBean.setIconvariation(jObj.getString("iconvariation"));

				log.info("Inside data Social link -- iBean Data : " + iBean);

				lBean.add(iBean);

			}

			mBean.setItems(lBean);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public List<SocialLinkTouchMultiBean> getMBean() {

		return this.multiList;

	}

}