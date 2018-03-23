package com.adobe.vikas.sample.aem.core.sightly;

import java.util.ArrayList;
import java.util.List;

import org.apache.sling.commons.json.JSONObject;

import com.adobe.cq.sightly.WCMUsePojo;

public class SampleWCMPojo extends WCMUsePojo {

	private List<SampleWCMSetterGetter> multifieldsItems = new ArrayList<SampleWCMSetterGetter>()

	;

	@Override
	public void activate() throws Exception {
		// TODO Auto-generated method stub

		setMultifieldsItems();

	}

	public List<SampleWCMSetterGetter> getMultifieldsItems() {
		return multifieldsItems;
	}

	public List<SampleWCMSetterGetter> setMultifieldsItems() {

		try {

			//			The value myUserSubmenu corresponds to the name of the dialog node that is the multifield

			String[] itemsProps = getProperties().get("mutifieldMenu", String[].class);

			if (itemsProps != null) {
				for (int i = 0; i < itemsProps.length; i++) {

					JSONObject jObj = new JSONObject(itemsProps[i]);

					String text = jObj.getString("text");
					String URL = jObj.getString("url");

					SampleWCMSetterGetter itemFromSetterGetter = new SampleWCMSetterGetter();

					itemFromSetterGetter.setText(text);
					itemFromSetterGetter.setText(URL);

					multifieldsItems.add(itemFromSetterGetter);
				}
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return multifieldsItems;
	}

}
