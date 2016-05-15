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
                    });
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
        var cardsLength = 0;
        var totalPower = 0;
        var totalToughness = 0;
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
            cardsLength += data[deckName][i].quantity;
        }
        html += '<div class="panel panel-default">' +
        '<div class="panel-heading" role="tab" id="headingFor'+deckName+'">'+
            '<h4 class="panel-title">'+
                '<a role="button" data-toggle="collapse" data-parent="#decks" href="#collapseFor'+deckName+'" aria-expanded="false" aria-controls="collapseFor'+deckName+'">'+
                    '<h4>Mono-Black</h4>'+
                '</a>'+
                
            '</h4>'+
            '<h5> | '+cardsLength+' cards</h5>'+
        '</div>'+
        '<p></p>'+
        '<div class="panel-collapse collapse" role="tabpanel" aria-labelledby="headingFor'+deckName+'" id="collapseFor'+deckName+'">'+
           ' <div class="panel-body">' + 
                '<ul class="list-group col-md-6">';
        
        // For each card...
        for(var i = 0; i < data[deckName].length; i++) {
            var card = findCardByName(data[deckName][i].cardName);
            
            if (card.type.toLowerCase().includes("creature")) {
                numberOfCreatures++;
            } else if (card.type.toLowerCase().includes("land")) {
                numberOfLands++
            } else if (card.type.toLowerCase().includes("instant") || card.type.toLowerCase().includes("spell")) {
                numberOfInstants++;
            }

            html += ' <li class="list-group-item card-group">'+
                       ' <img class="cardthumb" width="30px" src="'+allImages[card.name]+'">'+
                        '<span class="badge">'+data[deckName][i].quantity+'x</span>' +
                        '<div class="cardInfo">' +
                        '<span>'+data[deckName][i].cardName+'</span>'+
                        '<ul class="manaicons">';
            
            var manaCost = card.manaCost;
            if (manaCost) {
                var manas = manaCost.replace(/}/g, "").replace(/{/g, "").split("");
                console.log(manas);
                for(var index in manas) {
                    if(!isNaN(manas[index])){
                        console.log(manas[index]);
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
                                default:
                                    alert();
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
                '<ul class="list-group col-md-6">'+
               ' <li class="list-group-item"><p class="list-title">Total Power: <span class="value">'+totalPower+'</span></p>' +
               ' <p class="list-title">Total Toughness: <span class="value">'+totalToughness+'</span></p>' +
               ' <p class="list-title">Creatures: <span class="value">'+numberOfCreatures+'</span></p>' +
               ' <p class="list-title">Lands: <span class="value">'+numberOfLands+'</span></p>' +
               ' <p class="list-title">Instants/Spells: <span class="value">'+numberOfInstants+'</span></p>' +
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
           ' </div>'+
        '</div>'+
    '</div>';
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


