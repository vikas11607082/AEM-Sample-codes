package com.adobe.vikas.sample.aem.core.service.impl;


import com.adobe.granite.jmx.annotation.AnnotatedStandardMBean;
import com.adobe.granite.jmx.annotation.Name;
import com.adobe.vikas.sample.aem.core.service.LoginService;
import com.day.cq.replication.ReplicationActionType;
import com.day.cq.replication.ReplicationException;
import com.day.cq.replication.ReplicationOptions;
import com.day.cq.replication.Replicator;
import org.apache.felix.scr.annotations.*;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceResolverFactory;
import org.osgi.framework.Constants;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.jcr.Session;
import javax.management.DynamicMBean;
import javax.management.MBeanException;
import javax.management.NotCompliantMBeanException;
import javax.management.openmbean.CompositeDataSupport;
import javax.management.openmbean.CompositeType;
import javax.management.openmbean.OpenDataException;
import javax.management.openmbean.OpenType;
import javax.management.openmbean.SimpleType;
import javax.management.openmbean.TabularDataSupport;
import javax.management.openmbean.TabularType;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Component(
        label = "ACS AEM Samples - Sample Content Replication Harness",
        description = "Example of creating custom tooling to replicate content in a performant and controlled manner.",
        immediate = true
)
@Properties({
        @Property(
                label = "MBean Name",
                name = "jmx.objectname",
                value = "com.adobe.acs.samples.migration:type=Sample Content Replication Harness",
                propertyPrivate = true
        )
})

@Component(immediate = true, service = DynamicMBean.class, property = {
		"label=MBean Name",
		"",
		"",
		"",
		  label+  "=MBean Name",
          name + "=jmx.objectname",
          value + "=com.adobe.acs.samples.migration:type=Sample Content Replication Harness",
        
}


public class SampleContentReplicationHarnessImpl extends AnnotatedStandardMBean implements SampleContentReplicationHarness {

}
