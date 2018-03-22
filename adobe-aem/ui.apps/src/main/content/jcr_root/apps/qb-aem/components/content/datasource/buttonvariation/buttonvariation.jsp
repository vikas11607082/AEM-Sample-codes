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
    final Map<String, String> buttonscolor = new LinkedHashMap<String, String>();

    buttonscolor.put("so", "Select Options");
    buttonscolor.put("c-button c-button--direct-cta", "Green");
    buttonscolor.put("c-button", "Blue");
    buttonscolor.put("c-button c-button--direct-emphasis", "Orange"); 
    buttonscolor.put("c-button c-button--secondary", "Inverted Blue"); 
    buttonscolor.put("c-button c-button c-button--direct-cta c-button--direct-cta--secondary", "Inverted Green"); 




    final ResourceResolver resolver = resourceResolver;

    DataSource ds = new SimpleDataSource(new TransformIterator(buttonscolor.keySet().iterator(), new Transformer() {
        public Object transform(Object o) {
            String buttoncolor = (String) o;
            ValueMap vm = new ValueMapDecorator(new HashMap<String, Object>());

            vm.put("value", buttoncolor);
            vm.put("text", buttonscolor.get(buttoncolor));

            return new ValueMapResource(resolver, new ResourceMetadata(), "nt:unstructured", vm);
        }
    }));

    request.setAttribute(DataSource.class.getName(), ds);
%>