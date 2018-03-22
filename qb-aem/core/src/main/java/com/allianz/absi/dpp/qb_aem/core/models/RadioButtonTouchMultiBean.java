package com.allianz.absi.dpp.qb_aem.core.models;

import java.util.Map;

public class RadioButtonTouchMultiBean {

	private String dashboard;

	private Map<Integer, RadioButtonItemsBean> items;

	public Map<Integer, RadioButtonItemsBean> getItems() {

		return items;

	}

	public void setItems(Map<Integer, RadioButtonItemsBean> items) {

		this.items = items;

	}

	public String getDashboard() {

		return dashboard;

	}

	public void setDashboard(String dashboard) {

		this.dashboard = dashboard;

	}

}