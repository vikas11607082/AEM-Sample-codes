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
    final Map<String, String> buttonspositions = new LinkedHashMap<String, String>();

    buttonspositions.put("", "None");
    buttonspositions.put("u-margin-right-md", "Right");
    buttonspositions.put("u-margin-left-md", "Left");






    final ResourceResolver resolver = resourceResolver;

    DataSource ds = new SimpleDataSource(new TransformIterator(buttonsposition.keySet().iterator(), new Transformer() {
        public Object transform(Object o) {
            String buttonsposition = (String) o;
            ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());

            vm.put("value", buttonsposition);
            vm.put("text", buttonspositions.get(buttonsposition));

            return new ValueMapResource(resolver, new ResourceMetadata(), "nt:unstructured", vm);
        }
    }));

    request.setAttribute(DataSource.class.getName(), ds);
%>