<%--
  ADOBE CONFIDENTIAL

  Copyright 2013 Adobe Systems Incorporated
  All Rights Reserved.

  NOTICE:  All information contained herein is, and remains
  the property of Adobe Systems Incorporated and its suppliers,
  if any.  The intellectual and technical concepts contained
  herein are proprietary to Adobe Systems Incorporated and its
  suppliers and may be covered by U.S. and Foreign Patents,
  patents in process, and are protected by trade secret or copyright law.
  Dissemination of this information or reproduction of this material
  is strictly forbidden unless prior written permission is obtained
  from Adobe Systems Incorporated.
--%><%
%><%@include file="/libs/granite/ui/global.jsp"
%><%@page session="false"
          import="java.util.HashMap,
                  java.util.Iterator,
                  java.util.Map,
                  org.apache.commons.lang.StringUtils,
                  org.apache.sling.commons.json.JSONObject,
                  com.adobe.granite.ui.components.AttrBuilder,
                  com.adobe.granite.ui.components.Config,
                  com.adobe.granite.ui.components.Field,
                  com.adobe.granite.ui.components.Tag"%><%--###
ColorPicker
===========

.. granite:servercomponent:: /libs/granite/ui/components/foundation/form/colorpicker
   :supertype: /libs/granite/ui/components/foundation/form/field

   Colorpicker is a component that allows the user to pick predefined colors.
   The colors can be defined by configuring the sub-nodes with colors configuration.

   It extends :granite:servercomponent:`Field </libs/granite/ui/components/foundation/form/field>` component.

   It has the following content structure:

   .. gnd:gnd::

      [granite:FormColorPicker] > granite:FormField

      /**
       * The id attribute.
       */
      - id (String)

      /**
       * The class attribute. This is used to indicate the semantic relationship of the component similar to ``rel`` attribute.
       */
      - rel (String)

      /**
       * The class attribute.
       */
      - class (String)

      /**
       * The title attribute.
       */
      - title (String) i18n

      /**
       * The name that identifies the field when submitting the form.
       */
      - name (String)
      
      /**
       * The value of the field.
       */
      - value (StringEL)

      /**
       * Indicates if the field is in disabled state.
       */
      - disabled (Boolean)
      
      /**
       * Indicates if the field is mandatory to be filled.
       */
      - required (Boolean)
      
      /**
       * The name of the validator to be applied. E.g. ``foundation.jcr.name``.
       * See :doc:`validation </jcr_root/libs/granite/ui/components/foundation/clientlibs/foundation/js/validation/index>` in Granite UI.
       */
      - validation (String) multiple

      /**
       * Displays the classic mode with palette shades.
       */
      - classicPaletteType (Boolean)

      /**
       * Displays the freestyle mode without palette shades.
       */
      - freestylePaletteType (Boolean)

      /**
       * Displays edit mode for selected color.
       */
      - editType (Boolean)
###--%><%

    Config cfg = cmp.getConfig();
    ValueMap vm = (ValueMap) request.getAttribute(Field.class.getName());

    Resource mappingsRes = null;
    Resource rt = resourceResolver.getResource(resource.getResourceType());
    if (rt != null) {
        mappingsRes = rt.getChild("mappings");
    }
    
    Map<String, String> colors = new HashMap<String, String>();
    
    if (mappingsRes != null) {
        Iterator<Resource> itMappings = mappingsRes.listChildren();
        
        while (itMappings.hasNext()) {
            Config mappingCfg = new Config(itMappings.next());

            String name = mappingCfg.get("name", String.class);
            String value = mappingCfg.get("value", String.class);
            
            if (StringUtils.isNotEmpty(name) && StringUtils.isNotEmpty(value)) {
                colors.put(i18n.getVar(name), value);
            }
       }
    }

    Map<String, Boolean> pickerModes = new HashMap<String, Boolean>();
    pickerModes.put("classicPalette", cfg.get("classicPaletteType", false));
    pickerModes.put("freestylePalette", cfg.get("freestylePaletteType", false));
    pickerModes.put("edit", cfg.get("editType", false));
    
    // TODO use JSONStringer instead of JSONObject
    JSONObject colorpickerJson = new JSONObject();
    colorpickerJson.put("colors", colors);
    colorpickerJson.put("modes", pickerModes);
    
    
    Tag tag = cmp.consumeTag();
    AttrBuilder attrs = tag.getAttrs();

    attrs.add("id", cfg.get("id", String.class));
    attrs.addRel(cfg.get("rel", String.class));
    attrs.addClass(cfg.get("class", String.class));
    attrs.add("title", i18n.getVar(cfg.get("title", String.class)));
    
    attrs.addClass("coral-ColorPicker");
    attrs.add("data-init", "colorpicker");
    attrs.add("data-name", cfg.get("name", String.class));
    attrs.add("data-config", colorpickerJson.toString());
    attrs.add("value", vm.get("value", String.class));
    
    if (cfg.get("disabled", false)) {
        attrs.add("data-disabled", true);
    }
    
    if (cfg.get("required", false)) {
        attrs.add("aria-required", true);
    }

    String validation = StringUtils.join(cfg.get("validation", new String[0]), " ");
    attrs.add("data-validation", validation);

    attrs.addOthers(cfg.getProperties(), "id", "class", "rel", "title", "name", "disabled", "required", "validation", "value", "classicPaletteType", "freestylePaletteType", "editType", "fieldLabel", "fieldDescription", "renderReadOnly", "ignoreData");

%><span <%= attrs.build() %>><button class="coral-ColorPicker-button coral-MinimalButton" type="button"></button></span>