// On doc ready
$(document).ready(function () {
    // Test ajax
    loadPageAjax("_home");
}); // End of on doc ready

// Loads a file from content/ using AJAX
function loadPageAjax(nameOfPage, jumboTitle) {
    var _url = "./content/" + nameOfPage + ".html";
    $.ajax({
        url: _url,
        success: function (data) {
            changeContent(data);
            setActiveNavLink(nameOfPage);
            changeJumboTitle(jumboTitle);
        }
    });
}

// Changes the content of the page.
function changeContent(data) {
    $("#content").hide();
    $("#content").html(data);
    $("#content").fadeIn();
}

function setActiveNavLink(name) {
    $("ul.nav li").removeClass("active");
    $("ul.nav li[data-tab='" + name + "']").addClass("active");
    
}

function changeJumboTitle(name) {
    $(".jumbo-title").html(name);
}