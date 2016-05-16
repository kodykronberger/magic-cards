var dataArray = [];
var myOwnedCards = null;
var currentCard = null;
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
    
    $("#addToDeckButton").click(function(){
        $(".card-dialog").hide();
        $(".confirm-dialog").fadeIn();
    });
    $("#okButton").click(function(){
        var isValidDeck = true;
        if (!$("input[name='deck']:checked").val()) {
           isValidDeck = false;
        }

        if (!isValidDeck) {
            return toastr.warning("Please select a deck.");
        }

        $.post({
            "url": "./php/addCardToDeck.php",
            "data": {
                "deckName": $("input[name='deck']:checked").val(),
                "cardName": currentCard.name,
                "quantity": $("#cardQuantity").val(),
                "username": localStorage.getItem("username")
            },
            "success": function(result) {
                $("#cardModal").modal("hide");
                // Display alert message
                var message = "You have just added " + currentCard.name + " to " + $("input[name='deck']:checked").val() + "!";
                toastr.info(message);
            }
        });
    });
    $("#cancelButton, #cancelRemoveButton").click(function(){
        $("#cardModal").modal("hide");
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
            .replace(/\{1\}/g, '<span class="badge badge-number">1</span>')
            .replace(/\{2\}/g, '<span class="badge badge-number">2</span>')
            .replace(/\{3\}/g, '<span class="badge badge-number">3</span>')
            .replace(/\{4\}/g, '><span class="badge badge-number">4</span>')
            .replace(/\{5\}/g, '<span class="badge badge-number">5</span>')
    );
}

function insertStr(str, index, value) {
    return str.substr(0, index) + value + str.substr(index);
}

function populateCardList( data, images ) {
    // If cards exceeds limit, do not show..
    if (data.length > 200) {
        return toastr.warning("Too many records! Please narrow your search criteria.");
    }
    
    for (var i = 0; i < data.length; i++) {
        
        
        // Create list items for card
        var isOwned = "";
        
        for(var deck in myOwnedCards) {
            for (var card in myOwnedCards[deck]) {
                if (myOwnedCards[deck][card].cardName == data[i].name) {
                    isOwned += '<span class="badge badge-found">Found in <em>'+deck+'</em></span>';
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
        console.log(card.name);
        // Set up correct modal
        $(".card-dialog").show();
        $(".confirm-dialog").hide();

        $("#cardDetails").html(" ");
        if (card) {
            currentCard = card;
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
                colorHTML += renderManaImagesInString(card.manaCost)
                $("#cardDetails").append("<p style='display: inline-block; margin-right: 10px;'><strong>Mana Cost: </strong></p>" + colorHTML);
            }
        }

        $("#addToDeckButton").html("Add " + card.name + " to Deck");
        $("#deckRadios").empty();
        for(var deck in myOwnedCards) {
            var numberOfCards = 0;
            for (var card in myOwnedCards[deck]) {
                numberOfCards += myOwnedCards[deck][card].quantity;
            }
            $("#deckRadios").append("<input type='radio' class='form-group' name='deck' value='"+deck+"'>"+deck+" ("+numberOfCards+" cards)</option><br>");
        }
        $("#cardModal").modal("show");
    });
}