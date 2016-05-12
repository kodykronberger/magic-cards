// On doc ready
$(document).ready(function(){
    // Test ajax
    loadPageAjax("_home");
}); // End of on doc ready

function loadPageAjax(nameOfPage) {
    var _url = "../content/" + nameOfPage + ".html";
    $.ajax({
        url: _url,
        success: function( data ) {
            $("#content").html( data );
        }
    });
}