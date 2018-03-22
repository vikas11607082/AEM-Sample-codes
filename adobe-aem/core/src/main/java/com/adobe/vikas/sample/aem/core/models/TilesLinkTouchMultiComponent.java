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



public class TilesLinkTouchMultiComponent
		extends WCMUsePojo {

	/** Default log. */
	protected final Logger log = LoggerFactory.getLogger(this.getClass());

	private TilesLinkTouchMultiBean mBean = null;

	private TilesLinkItemsBean iBean = null;

	private List<TilesLinkItemsBean> lBean = null;

	private List<TilesLinkTouchMultiBean> multiList = null;

	@Override

	public void activate() throws Exception {

		log.info("##### CAROUSEL INVOKED ACTIVATE");

		multiList = new ArrayList<TilesLinkTouchMultiBean>();

		Node currentNode = getResource().adaptTo(Node.class);

		String[] tabs = { "i", "u", "uk" };

		for (int i = 0; i < tabs.length; i++) {

			String currentItem = tabs[i] + "Items";

			if (currentNode.hasProperty(currentItem)) {

				log.info("##### CAROUSEL COMPONENTS ITEMS ARE BEING SET" + currentItem);
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

			mBean = new TilesLinkTouchMultiBean();

			lBean = new ArrayList<TilesLinkItemsBean>();

			currentProperty = currentNode.getProperty(tab);

			if (currentProperty.isMultiple()) {

				value = currentProperty.getValues();

			} else {

				value = new Value[1];

				value[0] = currentProperty.getValue();

			}

			for (int i = 0; i < value.length; i++) {

				log.info("Inside Tiles links multifields components logic ");

				jObj = new JSONObject(value[i].getString());

				iBean = new TilesLinkItemsBean();

				iBean.setHeadtext(jObj.getString("headtext"));
				iBean.setTilesimage(jObj.getString("tilesimage"));
				iBean.setLinktext(jObj.getString("linktext"));
				iBean.setLinkurl(jObj.getString("linkurl"));
				iBean.setArrowvariation(jObj.getString("arrowvariation"));

				log.debug("Inside data Carousel -- iBean Data : " + iBean.getHeadtext());
				log.debug("Inside data Carousel -- iBean Data : " + iBean.getTilesimage());
				log.debug("Inside data Carousel -- iBean Data : " + iBean.getLinktext());
				log.debug("Inside data Carousel -- iBean Data : " + iBean.getLinkurl());
				log.debug("Inside data Carousel -- iBean Data : " + iBean.getArrowvariation());


				lBean.add(iBean);

			}

			mBean.setItems(lBean);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public List<TilesLinkTouchMultiBean> getMBean() {

		return this.multiList;

	}

}