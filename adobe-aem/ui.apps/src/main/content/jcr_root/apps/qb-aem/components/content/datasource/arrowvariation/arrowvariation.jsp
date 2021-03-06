<%@include file="/libs/granite/ui/global.jsp"%>
<%@ page import="com.adobe.granite.ui.components.ds.DataSource" %>
<%@ page import="com.adobe.granite.ui.components.ds.ValueMapResource" %>
<%@ page import="java.util.HashMap" %>
<%@ page import="org.apache.sling.api.wrappers.ValueMapDecorator" %>
<%@ page import="com.adobe.granite.ui.components.ds.SimpleDataSource" %>
<%@ page import="org.apache.commons.collections.iterators.TransformIterator" %>
<%@ page import="java.util.Map" %>
<%@ page import="java.util.LinkedHashMap" %>
<%@ page import="org.apache.commons.collections.Transformer" %>
<%@ page import="org.apache.sling.api.resource.*" %>

<%
    final Map<String, String> arrowvariations = new LinkedHashMap<String, String>();

    arrowvariations.put("so", "Select Options");
    arrowvariations.put("", "No arrow");
    arrowvariations.put("c-icon--arrow-right c-icon-flip", "Left arrow");
    arrowvariations.put("c-icon--arrow-right", "Right arrow");





    final ResourceResolver resolver = resourceResolver;

    DataSource ds = new SimpleDataSource(new TransformIterator(arrowvariations.keySet().iterator(), new Transformer() {
        public Object transform(Object o) {
            String arrowvariation = (String) o;
            ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());

            vm.put("value", arrowvariation);
            vm.put("text", arrowvariations.get(arrowvariation));

            return new ValueMapResource(resolver, new ResourceMetadata(), "nt:unstructured", vm);
        }
    }));

    request.setAttribute(DataSource.class.getName(), ds);
%>