package com.allianz.absi.dpp.qb_aem.core.models;

import java.util.List;

public class TilesTouchMultiBean {

	private String dashboard;

	private List<TilesItemsBean> items;

	public List<TilesItemsBean> getItems() {

		return items;

	}

	public void setItems(List<TilesItemsBean> items) {

		this.items = items;

	}

	public String getDashboard() {

		return dashboard;

	}

	public void setDashboard(String dashboard) {

		this.dashboard = dashboard;

	}

}