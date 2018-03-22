
function buttonfunction() {

    alert("inside button function");

   var cinput= $(this).find('.button-input').attr("button-color");
        console.log("button color"+cinput);

        if (cinput=="gr") {

              $(this).find(".button-input .c-button").addClass("c-button--direct-cta");


        }else if (cinput=="igr"){

               $(this).find(".button-input .c-button").addClass("c-button--direct-cta");
               $(this).find(".button-input .c-button").addClass("c-button--direct-cta--secondary");

        }else if (cinput=="org"){

              $(this).find(".button-input .c-button").addClass("c-button--direct-emphasis");

        }







}