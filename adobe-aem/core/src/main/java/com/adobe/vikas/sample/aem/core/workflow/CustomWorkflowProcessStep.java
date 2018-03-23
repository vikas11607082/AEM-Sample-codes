package com.adobe.vikas.sample.aem.core.workflow;


import org.osgi.framework.Constants;

import org.osgi.service.component.annotations.Component;

import com.adobe.granite.workflow.WorkflowException;
import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowData;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import com.adobe.granite.workflow.metadata.MetaDataMap;

@Component(

		service = CustomWorkflowProcessStep.class, property = {
				("process.label=" + "Custom workflow process step 1"),
				("Constants.SERVICE_VENDOR=" + "Vikash Kumar"),
				("Constants.SERVICE_DESCRIPTION=" + "Custom workflow process steps1 service")

		})


public class CustomWorkflowProcessStep implements WorkflowProcess {

	@Override
	public void execute(WorkItem item, WorkflowSession session, MetaDataMap args) throws WorkflowException {

		try {
		//code to get payload

		WorkflowData workflowdata = item.getWorkflowData();
		String jcr_payload = workflowdata.getPayload().toString();

		//Now jcr_payload is the content path which traverse through entire workflow lifecycle.

		//	lets get Id of the workflow item -  that value can be passed to another workflow step

		String workitemid = item.getId();

		//set this above workitem id to meatdata map in order to use this in next process step
		item.getWorkflowData().getMetaDataMap().put("ItemId", workitemid);
		}

		catch (Exception e) {
			e.printStackTrace();
		}
	}

}
