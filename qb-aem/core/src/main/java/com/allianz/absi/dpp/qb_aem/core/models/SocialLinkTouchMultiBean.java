package com.allianz.absi.dpp.qb_aem.core.models;

import java.util.List;

public class SocialLinkTouchMultiBean {

	private String dashboard;

	private List<SocialLinkItemsBean> items;

	public List<SocialLinkItemsBean> getItems() {

		return items;

	}

	public void setItems(List<SocialLinkItemsBean> items) {

		this.items = items;

	}

	public String getDashboard() {

		return dashboard;

	}

	public void setDashboard(String dashboard) {

		this.dashboard = dashboard;

	}

}