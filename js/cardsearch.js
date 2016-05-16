var dataArray = [];
var myOwnedCards = null;
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

function renderDataToPane( data ) {
    $.ajax({
        url: "./data/imageurls.json",
        success: function(imagedata){
            $.post({
                url: "./php/myDeck.php",
                data: { "username": currentuser },
                "success": function(result){
                    for (var deckName in result) {
                        myOwnedCards = JSON.parse(result);
                    }
                    populateCardList(data, imagedata)
                }
            });
            
        }
    });
}

function renderManaImagesInString(str) {
    if (str == null) {
        return "";
    }
    
    return (str
            .replace(/\{R\}/g, '<img class="color-image" width="20px" src="./img/redMana.png">')
            .replace(/\{W\}/g, '<img class="color-image" width="20px" src="./img/whiteMana.png">')
            .replace(/\{B\}/g, '<img class="color-image" width="20px" src="./img/blackMana.png">')
            .replace(/\{U\}/g, '<img class="color-image" width="20px" src="./img/blueMana.png">')
            .replace(/\{G\}/g, '<img class="color-image" width="20px" src="./img/greenMana.png">')
            .replace(/\{T\}/g, '<img class="color-image" width="20px" src="./img/tap.png">')
            .replace(/\{1\}/g, '<span class="badge badge-success">1</span>')
            .replace(/\{2\}/g, '<span class="badge badge-success">2</span>')
            .replace(/\{3\}/g, '<span class="badge badge-success">3</span>')
            .replace(/\{4\}/g, '><span class="badge badge-success">4</span>')
            .replace(/\{5\}/g, '<span class="badge badge-success">5</span>')
    );
}

function insertStr(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function populateCardList( data, images ) {
    // If cards exceeds limit, do not show..
    if (data.length > 200) {
        return alert("Please narrow down your search critera.");
    }
    
    for (var i = 0; i < data.length; i++) {
        
        
        // Create list items for card
        var isOwned = "";
        
        for(var deck in myOwnedCards) {
            for (var card in myOwnedCards[deck]) {
                if (myOwnedCards[deck][card].cardName == data[i].name) {
                    isOwned = '<span class="badge badge-found">Found in <em>'+deck+'</em></span>';
                    break;
                }
            }
        } 
        
        var search = $("#searchName").val().toLowerCase();
        var leftIndex = data[i].name.toLowerCase().indexOf(search);
        var rightIndex = leftIndex + search.length + 8;
        
        var output = insertStr(data[i].name, leftIndex, "<strong>");
        output = insertStr(output, rightIndex, "</strong>");
        
        var html = '<div class="media cards">' +
            '<div class="media-left">' +
            '<a href="#">' +
            '<img class="card-image" src="' + images[data[i].name] + '" />' +
            '</a>' +
            '</div>' +
            '<div class="media-body">' +
            '<h4 class="media-heading"><a class="cardName" data-cardname="'+data[i].name+'" style="cursor: pointer;">' + output + '</a>   '+isOwned+'</h4>' +
            '<p>' + data[i].type + '</p>';
        
        if (typeof data[i].power !== 'undefined' && typeof data[i].toughness !== 'undefined') {
                html += '<p>( ' + data[i].power + '/' + data[i].toughness + ' )</p>';
            }

        html +=  '<p>' + renderManaImagesInString(data[i].text) + '</p>' +
            '</div>' +
            '</div>';

        $("#resultsPane").append(html);
    }

    $(".cards .cardName").click(function () {
        // Set up modal
        var card = findCardByName($(this).attr("data-cardname"))

        $("#cardDetails").html(" ");
        if (card) {
            $(".modal-title").html(card.name)
            $(".card-imageModal").attr("src", images[card.name]);
            $("#cardDetails").append("<p>" + renderManaImagesInString(card.text) + "</p>")
            
            if (card.type != undefined) {
                $("#cardDetails").append("<p><strong>Type: </strong>" + card.type + "</p>");
            }
            if (card.power != undefined) {
                $("#cardDetails").append("<p><strong>Power: </strong>" + card.power + "</p>");
            }
            
            if (card.toughness != undefined) { 
                $("#cardDetails").append("<p><strong>Toughness: </strong>" + card.toughness + "</p>");
            }
            
            var colorHTML = "<ul class='manaicons'>";
                
            var manaCost = card.manaCost;
            if (manaCost) {
                var manas = manaCost.replace(/}/g, "").replace(/{/g, "").split("");
                for(var index in manas) {
                    if(!isNaN(manas[index])){
                        colorHTML += '<li><span class="badge badge-number">'+manas[index]+'</span></li>'
                    } else {
                        colorHTML += '<li><img width="23px" src="./img/';
                        switch(manas[index].toLowerCase()) {
                            case "r":
                                colorHTML += "redMana.png";
                                break;
                            case "w":
                                colorHTML += "whiteMana.png";
                                break;
                            case "u":
                                colorHTML += "blueMana.png";
                                break;
                            case "g":
                                colorHTML += "greenMana.png";
                                break;
                            case "b":
                                colorHTML += "blackMana.png";
                                break;
                            case "x":
                                colorHTML += "X.png";
                                break;
                            default:
                                break;
                        }
                        colorHTML += '"></li>'
                    }
                }
                colorHTML += '</ul>'
                $("#cardDetails").append("<p style='display: inline-block; margin-right: 10px;'><strong>Mana Cost: </strong></p>" + colorHTML);
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