var currentuser = localStorage.getItem("username");
var currentPage = localStorage.getItem("currentPage") || "_home";
var pageTitles = {
    "_home": "Home",
    "_cards": "Card Search",
    "_users": "Users",
    "_mydeck": "My Deck",
    "_profile": "Profile"
}

// On doc ready
$(document).ready(function () {
    // Redirect to home page;
    loadPageAjax(currentPage, pageTitles[currentPage]);
    // Handle whether used is logged in
    if (currentuser == null) {
        changeLoginNav(false);
    } else {
        changeLoginNav(true);
    }

    // Create hover event for user nav
    $("#username").mouseenter(function () {
        $("#username").stop().animate({
            "font-size": "1.4em"
        }, 500);
        $(".userdetails").addClass("active");
    }).mouseleave(function () {
        $("#username").stop().animate({
            "font-size": "1.3em"
        }, 500);
        $(".userdetails").removeClass("active");
    });

}); // End of on doc ready

// **************************
// * UI functions
// **************************

// Loads a file from content/ using AJAX
function loadPageAjax(nameOfPage, jumboTitle) {
    var _url = "./content/" + nameOfPage + ".html";
    $.ajax({
        url: _url,
        success: function (data) {
            changeContent(data);
            setActiveNavLink(nameOfPage);
            changeJumboTitle(jumboTitle);
            localStorage.setItem("currentPage", nameOfPage);
        }
    });
}

// Changes the content of the page.
function changeContent(data) {
    $("#content").hide();
    $("#content").html(data);
    $("#content").fadeIn();
}

// Sets the correct navbar link to active
function setActiveNavLink(name) {
    $("ul.nav li").removeClass("active");
    $("ul.nav li[data-tab='" + name + "']").addClass("active");
}

// Changes the h1 text within the Jumbotron
function changeJumboTitle(name) {
    $(".jumbo-title").html(name);
}

// Toggles the state of the login navbar
function changeLoginNav(loggedIn) {
    if (loggedIn) {
        $("#nav-loggedIn").show();
        $("#nav-loggedOut").hide();
        $("#username").html(currentuser);
    } else {
        $("#nav-loggedIn").hide();
        $("#nav-loggedOut").show();
    }
}

// **************************
// * Login functions
// **************************

function login() {
    localStorage.setItem("username", "kodykronberger")
}

function logout() {
    localStorage.removeItem("username")
}

function register() {
    currentuser = localStorage.setItem("username", "kodykronberger");
    alert();
}