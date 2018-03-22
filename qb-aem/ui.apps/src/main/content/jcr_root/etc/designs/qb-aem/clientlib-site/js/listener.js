(function ($, $document) {
    "use strict";
 
      $document.on("dialog-ready", function() {
        $(window).adaptTo("foundation-ui").alert("Open", "Dialog now open, event [dialog-ready]");
    });
 
    $(document).on("click", ".cq-dialog-submit", function (e) {
        $(window).adaptTo("foundation-ui").alert("Close", "Dialog closed, selector [.cq-dialog-submit]");
    });
 
    $document.on("dialog-ready", function() {
        document.querySelector('form.cq-dialog').addEventListener('submit', function(){
            //$(window).adaptTo("foundation-ui").alert("Close", "Dialog closed, selector [form.cq-dialog]");
        }, true);
    });
 
    $document.on("dialog-success", function() {
        //$(window).adaptTo("foundation-ui").alert("Save", "Dialog content saved, event [dialog-success]");
    });
 
    $document.on("dialog-closed", function() {
        $(window).adaptTo("foundation-ui").alert("Close", "Dialog closed, event [dialog-closed]");
    });
})($, $(document));