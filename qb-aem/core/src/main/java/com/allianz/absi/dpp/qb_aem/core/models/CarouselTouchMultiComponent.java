package com.allianz.absi.dpp.qb_aem.core.models;


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



public class CarouselTouchMultiComponent
		extends WCMUsePojo {

	/** Default log. */
	protected final Logger log = LoggerFactory.getLogger(this.getClass());

	private CarouselTouchMultiBean mBean = null;

	private CarouselItemsBean iBean = null;

	private List<CarouselItemsBean> lBean = null;

	private List<CarouselTouchMultiBean> multiList = null;

	@Override

	public void activate() throws Exception {

		log.info("##### CAROUSEL INVOKED ACTIVATE");

		multiList = new ArrayList<CarouselTouchMultiBean>();

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

			mBean = new CarouselTouchMultiBean();

			lBean = new ArrayList<CarouselItemsBean>();

			currentProperty = currentNode.getProperty(tab);

			if (currentProperty.isMultiple()) {

				value = currentProperty.getValues();

			} else {

				value = new Value[1];

				value[0] = currentProperty.getValue();

			}

			for (int i = 0; i < value.length; i++) {

				log.info("Inside data Carousel ");

				jObj = new JSONObject(value[i].getString());

				iBean = new CarouselItemsBean();

				iBean.setTitletext(jObj.getString("titletext"));
				iBean.setSubtitletext(jObj.getString("subtitletext"));
				iBean.setTeaserimage(jObj.getString("teaserimage"));
				iBean.setTeaserratingimage(jObj.getString("teaserratingimage"));
				iBean.setTeaserparagraph(jObj.getString("teaserparagraph"));

				log.debug("Inside data Carousel -- iBean Data : " + iBean.getTitletext());
				log.debug("Inside data Carousel -- iBean Data : " + iBean.getSubtitletext());
				log.debug("Inside data Carousel -- iBean Data : " + iBean.getTeaserimage());
				log.debug("Inside data Carousel -- iBean Data : " + iBean.getTeaserratingimage());
				log.debug("Inside data Carousel -- iBean Data : " + iBean.getTeaserparagraph());

				lBean.add(iBean);

			}

			mBean.setItems(lBean);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

	public List<CarouselTouchMultiBean> getMBean() {

		return this.multiList;

	}

}