(function ($, $document) {
    "use strict";
    
    var LANGUAGE = "./language", COUNTRY = "./country";
    
    function adjustLayoutHeight(){
        $(".coral-FixedColumn-column").css("height", "20rem");
    }
    
    $document.on("dialog-ready", function() {
        adjustLayoutHeight();
        
        // Getting reference of language drop down field
        var language = $("[name='" + LANGUAGE +"']").closest(".coral-Select")
        
        // Initializing country drop down field
        var country = new CUI.Select({
            element: $("[name='" + COUNTRY +"']").closest(".coral-Select")
        });
        
        if(_.isEmpty(country) || _.isEmpty(language)){
            return;
        }
        
        var langCountries = {};
        
        country._selectList.children().not("[role='option']").remove();
        
        function fillCountries(selectedLang, selectedCountry){

            var x = $("[name='./country']").closest(".coral-Select").find('option').remove().end();
            _.each(langCountries, function(value, lang) {

                if( (lang.indexOf(selectedLang) !== 0) || (value.country == "*") ){
                    return;
                }

                var test2 = $("[name='./country']")[0];

                $("<option>").appendTo(test2).val(lang).html(value.country);

            });

            country = new CUI.Select({
                element: $("[name='" + COUNTRY +"']").closest(".coral-Select")
            });
            
            
            if(!_.isEmpty(selectedCountry)){
                
                country.setValue(selectedCountry);
                
            }
            
        }
        
        //listener on language select for dynamically filling the countries on language select
        language.on('selected.select', function(event){
            console.log(event);
            fillCountries(event.selected);
        });
        
        // Get the languages list from the source
        $.getJSON("/libs/wcm/core/resources/languages.2.json").done(function(data){
            langCountries = data;
            
            var $form = country.$element.closest("form");
            
            //get the second select box (country) saved value
            $.getJSON($form.attr("action") + ".json").done(function(data){
                if(_.isEmpty(data)){
                    return;
                }

                // Passing values to populate countries list
                fillCountries(language.val(), data.country);
            })
        });
        
        
    });
})($, $(document));