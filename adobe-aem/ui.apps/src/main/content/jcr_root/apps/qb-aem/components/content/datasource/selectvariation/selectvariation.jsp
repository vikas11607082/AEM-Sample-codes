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
    final Map<String, String> languages = new LinkedHashMap<String, String>();

    languages.put("cb", "Car body");
    languages.put("ft", "Fuel type");
    languages.put("cm", "Car model");
    languages.put("ce", "Car engine");
    languages.put("se", "Standard equipment");
    languages.put("ats", "Anti theft security");
    languages.put("sw", "Side of wheel");


    final ResourceResolver resolver = resourceResolver;

    DataSource ds = new SimpleDataSource(new TransformIterator(languages.keySet().iterator(), new Transformer() {
        public Object transform(Object o) {
            String language = (String) o;
            ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());

            vm.put("value", language);
            vm.put("text", languages.get(language));

            return new ValueMapResource(resolver, new ResourceMetadata(), "nt:unstructured", vm);
        }
    }));

    request.setAttribute(DataSource.class.getName(), ds);
%>