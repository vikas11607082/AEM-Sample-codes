
$(document).ready(function() {
    console.log( "ready!" );


    function renderHtml(){

        var path="";
        var input= $('.data').attr("value");

        if (input=="cb") {

            $(".add-sightly-include").addAttribute("data-sly-include","carbody.html");


        } else if (input=="ft"){

               $(".add-sightly-include").addAttribute("data-sly-include","fueltype.html");



            }


       }








});

