var dataArray = [];
var searchParameters = {
    "name": null,
    "manaColor": null,
    "manaCost": null,
    "power": null,
    "toughness": null
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
    
    // Set up dropdowns
    $('#manaCostDropdown li a').on('click', function(){
        searchParameters.manaCost = Number($(this).text());
        renderFilters ()
    });
    
    $('#manaColorDropdown li a').on('click', function(){
        searchParameters.manaColor = $(this).text();
        renderFilters ()
    });
    
    $('#powerDropdown li a').on('click', function(){
        searchParameters.power = Number($(this).text());
        renderFilters ()
    });
    
    $('#toughnessDropdown li a').on('click', function(){
        searchParameters.toughness = Number($(this).text());
        renderFilters ()
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

function renderFilters () {
    $("#filtersPane").empty();
    
    if (searchParameters.manaCost != null) {
        $("#filtersPane").append("<span class='tag label label-default'><span>" + searchParameters.manaCost + "</span><a style='cursor: pointer;'>x</a></span></span> ");
    }
    if (searchParameters.manaColor != null) {
        $("#filtersPane").append("<span class='label label-default'>" + searchParameters.manaColor + "</span>");
    }
    if (searchParameters.power != null) {
        $("#filtersPane").append("<span class='label label-default'>" + searchParameters.power + "</span>");
    }
    if (searchParameters.toughness != null) {
        $("#filtersPane").append("<span class='label label-default'>" + searchParameters.toughness + "</span>");
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

    $(".cards .cardName").click(function () {
        // Set up modal
        var card = findCardByName($(this).html())
        console.log(card);

        $("#cardDetails").html(" ");
        if (card) {
            $(".modal-title").html(card.name)
            $("#cardDetails").append("<p>" + card.text + "</p>")
            
            if (card.type != undefined) {
                $("#cardDetails").append("<p><strong>Type: </strong>" + card.type + "</p>");
            }
            if (card.power != undefined) {
                $("#cardDetails").append("<p><strong>Power: </strong>" + card.power + "</p>");
            }
            
            if (card.toughness != undefined) { 
                $("#cardDetails").append("<p><strong>Toughness: </strong>" + card.toughness + "</p>");
            }
                
            var colorList = "<p><strong>Colors: </strong></p><ul>";
            if (card.colors != undefined) {
                for (var j = 0; j < card.colors.length; j++) {
                    colorList += "<li>" + card.colors[j] + "</li>";
                }

                $("#cardDetails").append(colorList)
            }
        }

        //        $("#cardTitle").html(card.name);
        //        $("#cardText").html(card.text);
        //        $("#cardType").html(card.type);
        //        $("#cardRarity").html("Rarity: " + card.rarity);
        //        $("#cardPower").html("Power: " + card.power);
        //        $("#cardToughness").html("Thoughness: " + card.toughness);
        //        $("#cardColors").html(card.colors);
        $("#cardModal").modal("show");
    });
}