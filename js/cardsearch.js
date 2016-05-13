var dataArray = [];
var searchParameters = {
    "name": null
}

$("document").ready(function () {
    var _url = "./data/AllCards.json";

    $.ajax({
        "url": _url,
        "dataType": "json",
        "success": function (data) {
            for (var key in data) {
                dataArray.push(data[key]);
            }
            
            console.log(dataArray);
        }
    });

    // Set up filter variables
    $("cardModal").modal();
    $("#search").click(function () {
        var searchName = $("#searchName").val();
        filterCards(searchName);
    });
});


function filterCards(searchName) {
    $("#resultsPane").empty();

    var tempData = [];

    tempData = filterCards_byName(dataArray, searchName);

    renderDataToPane(tempData);
}

function filterCards_byName(data, searchName) {
    var tempData = [];

    for (var i = 0; i < data.length; i++) {
        if (data[i].name.toLowerCase().includes(searchName.toLowerCase())) {
            tempData.push(data[i]);
        }
    }

    return tempData;
}

function findCardByName (name) {
    for(var i = 0; i < dataArray.length; i++) {
        if (dataArray[i].name == name) {
            return dataArray[i];
        }
    }
}

function renderDataToPane(data) {
    for (var i = 0; i < data.length; i++) {
        
        // Create list items for card
        var item = $('<div class="media cards">' +
            '<div class="media-left">' +
            '<a href="#">' +
            '<img class="card-image" src="./img/randomCard.jpg" />' +
            '</a>' +
            '</div>' +
            '<div class="media-body">' +
            '<h4 class="media-heading"><a class="cardName" style="cursor: pointer;">' + data[i].name + '</a></h4>' +
            '<p>' + data[i].text + '</p>' +
            '</div>' +
            '</div>');
        
        console.log(data[i].name);
        
        $("#resultsPane").append(item);
    }
    
    $(".cards .cardName").click(function() {
        // Set up modal
        var card = findCardByName ($(this).html())
        console.log(card);
        $("#cardTitle").html(card.name);
        $("#cardText").html(card.text);
        $("#cardType").html(card.type);
        $("#cardRarity").html("Rarity: " + card.rarity);
        $("#cardPower").html("Power: " + card.power);
        $("#cardToughness").html("Thoughness: " + card.toughness);
        $("#cardColors").html(card.colors);
        $("#cardModal").modal("show");
    });
}