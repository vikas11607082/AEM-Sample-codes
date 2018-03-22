package com.allianz.absi.dpp.qb_aem.core.models;

import java.util.List;

public class TilesLinkTouchMultiBean {

	private String dashboard;

	private List<TilesLinkItemsBean> items;

	public List<TilesLinkItemsBean> getItems() {

		return items;

	}

	public void setItems(List<TilesLinkItemsBean> items) {

		this.items = items;

	}

	public String getDashboard() {

		return dashboard;

	}

	public void setDashboard(String dashboard) {

		this.dashboard = dashboard;

	}

}