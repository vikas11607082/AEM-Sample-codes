package com.allianz.absi.dpp.qb_aem.core.models;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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



public class RadioButtonTouchMultiComponent
		extends WCMUsePojo {

	/** Default log. */
	protected final Logger log = LoggerFactory.getLogger(this.getClass());

	private RadioButtonTouchMultiBean mBean = null;

	private RadioButtonItemsBean iBean = null;

	private Map<Integer, RadioButtonItemsBean> lBean = null;

	private List<RadioButtonTouchMultiBean> multiList = null;

	@Override

	public void activate() throws Exception {

		log.info("##### INVOKED Radio button component ACTIVATE");

		multiList = new ArrayList<RadioButtonTouchMultiBean>();

		Node currentNode = getResource().adaptTo(Node.class);

		String[] tabs = { "i", "u", "uk" };

		for (int i = 0; i < tabs.length; i++) {

			String currentItem = tabs[i] + "Items";

			if (currentNode.hasProperty(currentItem)) {

				log.info("##### Radio button component ITEMS ARE BEING SET" + currentItem);
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

			mBean = new RadioButtonTouchMultiBean();

			lBean = new HashMap<Integer, RadioButtonItemsBean>();

			currentProperty = currentNode.getProperty(tab);

			if (currentProperty.isMultiple()) {

				value = currentProperty.getValues();

			} else {

				value = new Value[1];

				value[0] = currentProperty.getValue();

			}

			for (int i = 0; i < value.length; i++) {

				jObj = new JSONObject(value[i].getString());

				iBean = new RadioButtonItemsBean();

				iBean.setRadiotext(jObj.getString("radiotext"));



				lBean.put(new Integer(i), iBean);
				log.info("##### printting" + lBean);
			}

			mBean.setItems(lBean);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public List<RadioButtonTouchMultiBean> getMBean() {

		return this.multiList;

	}

}