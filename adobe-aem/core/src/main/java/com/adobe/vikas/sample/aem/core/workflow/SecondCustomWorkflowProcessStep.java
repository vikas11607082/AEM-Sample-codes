package com.adobe.vikas.sample.aem.core.workflow;

import org.osgi.framework.Constants;

import org.osgi.service.component.annotations.Component;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;

@Component(

		service = SecondCustomWorkflowProcessStep.class, property = {
				("process.label=" + "Custom workflow process step 2"),
				("Constants.SERVICE_VENDOR =" + "Vikash Kumar"),
				("Constants.SERVICE_DESCRIPTION=" + "Custom workflow process steps2 service")

		})
public class SecondCustomWorkflowProcessStep implements WorkflowProcess {

	@Override
	public void execute(WorkItem item, WorkflowSession session, MetaDataMap args) throws WorkflowException {


		try {

			String getworkItemId = item.getWorkflowData().getMetaDataMap().get("ItemId").toString();

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

}
