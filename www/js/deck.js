var currentuser = localStorage.getItem("username");
var allCards = [];
var allImages = [];

$("document").ready(function(){
//    if (!currentuser) {
//        alert("Not signed in..");
//    } else {
//        $.post({
//            url: "./php/myDeck.php",
//            data: { "username": currentuser },
//            "success": function(result){
//                getAllCards(function(data){
//                    for (var key in data) {
//                        allCards.push(data[key]);
//                    }
//                    getAllImages(function(data){
//                        allImages = data;
//                        populateDecks(JSON.parse(result));
//                    });
//                });
//            }
//        });
//    }
    $.post({
        url: "./getUserDecks",
        data: { "userName": currentuser },
        success: function( result ) {
            console.log(result);
            getAllCards(function(data){
                for (var key in data) {
                    allCards.push(data[key]);
                }
                getAllImages(function(data){
                    allImages = data;
                    populateDecks(result);
                });
            });
        }
    });
    
    $("#addDeckButton").click(function(){
        $.post({
            url: "./addDeck",
            data: { "deckName": "Testing deck add 3Fa", userName: currentuser },
            success: function( result ) {
                alert("Success!")
            }
        });
    });
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
    var numberOfDecks = 0;
    for (var deckName in data) {
        numberOfDecks++
        var cardsLength = 0;
        var totalPower = 0;
        var totalToughness = 0;
        var numberOfEnchants = 0;
        var numberOfCreatures = 0;
        var numberOfInstants = 0;
        var numberOfLands = 0;
        var mainColors = {
            "white": 0,
            "blue": 0,
            "red": 0,
            "black": 0,
            green: 0
        };
        for(var i = 0; i < data[deckName].length; i++) {
            cardsLength += 1;
        }
        html += '<div class="panel panel-default">' +
        '<div class="panel-heading" role="tab" id="headingFor'+numberOfDecks+'">'+
            '<h4 class="panel-title">'+
                '<a role="button" data-toggle="collapse" data-parent="#decks" href="#collapseFor'+numberOfDecks+'" aria-expanded="false" aria-controls="collapseFor'+numberOfDecks+'">'+
                    '<h4>'+deckName+'</h4>'+
                '</a>'+
                
            '</h4>'+
            '<h5> | '+cardsLength+' cards</h5>'+
        '</div>'+
        '<p></p>'+
        '<div class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFor'+numberOfDecks+'" id="collapseFor'+numberOfDecks+'">'+
           ' <div class="panel-body">' + 
                '<ul class="list-group col-md-6">';
        
        // For each card...
        for(var i = 0; i < data[deckName].length; i++) {
            var card = findCardByName(data[deckName][i].cardName);
            
            if (card.type.toLowerCase().includes("creature")) {
                numberOfCreatures += 1;
            } else if (card.type.toLowerCase().includes("land")) {
                numberOfLands += 1;
            } else if (card.type.toLowerCase().includes("sorcery") || card.type.toLowerCase().includes("spell") || card.type.toLowerCase().includes("instant")) {
                numberOfInstants += 1;
            } else if (card.type.toLowerCase().includes("enchantment")) {
                numberOfEnchants += 1;
            }

            html += ' <li class="list-group-item card-group">'+
                       ' <img class="cardthumb" width="30px" src="'+allImages[card.name]+'">'+
                        '<span class="badge">'+1+'x</span>' +
                        '<button data-deck="'+deckName+'" data-card="'+card.name+'" class="btn btn-error btn-sm discard">Discard</button>' +
                        '<div class="cardInfo">' +
                        '<span class="cardname">'+data[deckName][i].cardName+'</span>'+
                        '<ul class="manaicons">';
            
            var manaCost = card.manaCost;
            if (manaCost) {
                var manas = manaCost.replace(/}/g, "").replace(/{/g, "").split("");
                for(var index in manas) {
                    if(!isNaN(manas[index])){
                        html += '<li><span class="badge badge-success">'+manas[index]+'</span></li>'
                    } else {
                        html += '<li><img width="20px" src="./img/';
                            switch(manas[index].toLowerCase()) {
                                case "r":
                                    html += "redMana.png";
                                    mainColors.red++;
                                    break;
                                case "w":
                                    html += "whiteMana.png";
                                    mainColors.white++;
                                    break;
                                case "u":
                                    html += "blueMana.png";
                                    mainColors.blue++;
                                    break;
                                case "g":
                                    html += "greenMana.png";
                                    mainColors.green++;
                                    break;
                                case "b":
                                    html += "blackMana.png";
                                    mainColors.black++;
                                    break;
                                case "x":
                                    colorHTML += "X.png";
                                    break;
                                default:
                                    break;
                            }
                        html += '"</li>'
                    }
                }
            }
            
            if (typeof card.power !== 'undefined' && typeof card.toughness !== 'undefined') {
                html += '<span class="card-stats">( '+card.power+'/'+card.toughness+' )</span>';
                totalPower += Number(card.power);
                totalToughness += Number(card.toughness);
            }
                            
            html +='</ul></div></li>';
        }

            html += '</ul>' +
                '<ul class="list-group col-md-3">'+
               ' <li class="list-group-item"><p class="list-title">Total Power: <span class="value">'+totalPower+'</span></p>' +
               ' <p class="list-title">Total Toughness: <span class="value">'+totalToughness+'</span></p>' +
               ' <p class="list-title">Creatures: <span class="value">'+numberOfCreatures+'</span></p>' +
               ' <p class="list-title">Instants/Spells: <span class="value">'+numberOfInstants+'</span></p>' +
                ' <p class="list-title">Enchantments: <span class="value">'+numberOfEnchants+'</span></p>' +
                ' <p class="list-title">Lands: <span class="value">'+numberOfLands+'</span></p>' +
                   ' <em>Colors: </em>';

            if(mainColors.black > 0) {
                html += ' <img class="color-image" width="30px" src="./img/blackMana.png">';
            }
            if(mainColors.blue > 0) {
                html += ' <img class="color-image" width="30px" src="./img/blueMana.png">';
            }
            if(mainColors.green > 0) {
                html += ' <img class="color-image" width="30px" src="./img/greenMana.png">';
            }
            if(mainColors.red > 0) {
                html += ' <img class="color-image" width="30px" src="./img/redMana.png">';
            }
            if(mainColors.white > 0) {
                html += ' <img class="color-image" width="30px" src="./img/whiteMana.png">';
            }

            html += '</li></ul>'+
                '<div class="col-md-3" id="cardChart"></div>' +
           ' </div>'+
        '</div>'+
    '</div>';
    }

    $("#numberOfDecks").html(numberOfDecks);
    $("#decks").empty().html(html);
    
    // Set up discard buttons
    $(".discard").click(function(){
        $(this).removeClass("btn-error");
        $(this).addClass("btn-warning");
        $(this).html("Are you sure?");
        
        $(this).click(function(){
            var cardName = $(this).attr("data-card");
            var deckName = $(this).attr("data-deck");

            $.post({
                url: "./removeCardFromDeck",
                data: {
                    "cardName": cardName,
                    "deckName": deckName,
                    "userName": currentuser
                },
                success: function(result){
                    location.reload();
                }
            });
        });
    });
    
    $("#loadingModal").modal("hide");
}

function getAllCards (successFunction) {
    var _url = "./getCards";

    $.ajax({
        "url": _url,
        "dataType": "json",
        "success": function (data) {
            successFunction(data);
        }
    });
}

function getAllImages (successFunction) {
    var _url = "./getCardImages";

    $.ajax({
        "url": _url,
        "dataType": "json",
        "success": function (data) {
            successFunction(data);
        }
    });
}


