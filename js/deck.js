var currentuser = localStorage.getItem("username");
var allCards = [];
var allImages = [];

$("document").ready(function(){
    if (!currentuser) {
        alert("Not signed in..");
    } else {
        $.post({
            url: "./php/myDeck.php",
            data: { "username": currentuser },
            "success": function(result){
                getAllCards(function(data){
                    for (var key in data) {
                        allCards.push(data[key]);
                    }
                    getAllImages(function(data){
                        allImages = data;
                        populateDecks(JSON.parse(result));
                    })
                });
            }
        });
    }
});

function findCardByName (name) {
    for(var i = 0; i < allCards.length; i++) {
        if (allCards[i].name == name) {
            return allCards[i];
        }
    }
}

function populateDecks (data) {
    var html = "";

    for (var deckName in data) {
        html += "<h1>"+deckName+"</h1><hr>"
    }
    
    $("#decks").empty().html(html);
}

function getAllCards (successFunction) {
    var _url = "./data/AllCards.json";

    $.ajax({
        "url": _url,
        "dataType": "json",
        "success": function (data) {
            successFunction(data);
        }
    });
}

function getAllImages (successFunction) {
    var _url = "./data/imageurls.json";

    $.ajax({
        "url": _url,
        "dataType": "json",
        "success": function (data) {
            successFunction(data);
        }
    });
}


