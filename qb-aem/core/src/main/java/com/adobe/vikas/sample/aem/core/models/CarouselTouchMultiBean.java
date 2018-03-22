package com.adobe.vikas.sample.aem.core.models;

import java.util.List;

public class CarouselTouchMultiBean {

	private String dashboard;

	private List<CarouselItemsBean> items;

	public List<CarouselItemsBean> getItems() {

		return items;

	}

	public void setItems(List<CarouselItemsBean> items) {

		this.items = items;

	}

	public String getDashboard() {

		return dashboard;

	}

	public void setDashboard(String dashboard) {

		this.dashboard = dashboard;

	}

}