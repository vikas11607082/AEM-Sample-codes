  $( document ).ready(function() {


        var path="";
        var input= $('.data').attr("value");

        if (input=="cb") {

            $(".data_cb").show();

            } 

        else if (input=="ft"){   


               $(".data_ft").show();

             }

        else if (input=="cm"){   


               $(".data_cm").show();

             }

         else if (input=="ce"){   


               $(".data_ce").show();

             }


          else if (input=="se"){   
             

               $(".data_se").show();

             }


          else if (input=="ats"){   


               $(".data_ats").show();

             }

          else if (input=="sw"){   

               $(".data_sw").show();

             }




     var c = 0;
    $(".c-carousel__three-column__slide").each(function(){
       console.log("Inside loop for carousel");
    $(this).attr("data-swiper-slide-index",+c);
     c++;

        if($(this).attr('data-swiper-slide-index') ==0) {
            console.log("inside llop if conditon");
                $(".c-carousel__three-column__slide").addClass("swiper-slide-active");


        }

    });








});