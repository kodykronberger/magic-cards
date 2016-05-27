/*
    Creates a server, that serves up local static files.
    Created by: Dakota Kronberger
*/
var cardData = require("./data/AllCards.json")
var imageData = require("./data/imageurls.json")
var filters = require("./filters");

/*
    %%%%%%%%%%%%%%
        SERVER
    %%%%%%%%%%%%%%
*/
var express = require("express");
var bodyParser = require("body-parser");
var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('www'));

/*
    %%%%%%%%%%%%%%%%%
        Card API
    %%%%%%%%%%%%%%%%%
*/
// Turn card data into array form, instead of key-value pairs.
function createCardArray(){
    result = []
    
    for (var cardname in cardData) {
        var card = cardData[cardname];
        card.imageUrl = imageData[cardname];
        result.push(card);
    }
    
    return result;
};

// Main API HTTP request endpoint
app.get('/getCards', function(req, res) {
    console.log("getCards:");
    
    // Initialize card array.
    var jsonResult = createCardArray();
    
    // Retreive parameters from url.
    var parameters = {
        "name": req.query.name,
        "power": req.query.power,
        "toughness": req.query.toughness,
        "manaCost": req.query.manaCost,
        "manaColor": req.query.manaColor
    };
    
    // Filter based on name.
    if (parameters.name) {
        jsonResult = filters.filterByName(jsonResult, parameters.name.toString());
        console.log("\tName: " + parameters.name);
    }
    
    // Filter based on power.
    if (parameters.power) {
        jsonResult = filters.filterByPower(jsonResult, parameters.power.toString());
        console.log("\tPower: " + parameters.power);
    }
    
    // Filter based on toughness.
    if (parameters.toughness) {
        jsonResult = filters.filterByToughness(jsonResult, parameters.toughness.toString());
        console.log("\tToughness: " + parameters.toughness);
    }
    
    // Filter based on mana Cost.
    if (parameters.manaCost) {
        jsonResult = filters.filterByManaCost(jsonResult, parameters.manaCost.toString());
        console.log("\tMana Cost: " + parameters.manaCost);
    }
    
    // Filter based on mana Color.
    if (parameters.manaColor) {
        jsonResult = filters.filterByManaColor(jsonResult, parameters.manaColor.toString());
        console.log("\tMana Color: " + parameters.manaColor);
    }
    
    res.json(jsonResult);
});

app.get('/getCardImages', function(req, res) {
    res.json(imageData);
});

/*
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
        MongoDB classes/functions
    %%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
*/
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://mtguser:counter480@ds039185.mlab.com:39185/mtg');


// Schemas
var DeckSchema = new Schema({
    name: String,
    userId: { type: Schema.Types.ObjectId, ref: 'UserSchema' }
});

var UserSchema = new Schema({
    name: {
        first: String,
        last: String
    },
    email: String,
    country: String,
    userName: String
});

var DeckCardSchema = new Schema({
    cardName: String,
    deckId: { type: Schema.Types.ObjectId, ref: 'DeckSchema' }
}); // end schemas

// Models
var Deck = mongoose.model("Deck", DeckSchema);
var User = mongoose.model("User", UserSchema);
var DeckCard = mongoose.model("DeckCard", DeckCardSchema); // end models

// Functions
app.post('/addDeck', function(req, res) {
    // Set up data
    var data = req.body;
    var userName = data.userName,
        deckName = data.deckName;
    
    User.findOne({ userName: userName }).exec(function (err, result) {
        if (err) {
            return console.error(err);
        }
        
        // Create new deck
        if (result) {
            Deck.create({ name: deckName, userId: result._id }, function (err, result) {
                if (err) {

                    return console.error(err);
                }
                console.log("Deck: " + deckName + " created successfully!");
                res.send();
            });
        }
    });
});

app.post('/addCardToDeck', function(req, res) {
    // Set up data
    var data = req.body;
    var userName = data.userName,
        deckName = data.deckName,
        cardName = data.cardName;
    
    console.log(data);
    
    // Get user id
    User.findOne({ userName: userName }).exec(function (err, result) {
        if (err) {
            return console.error(err);
        }
        console.log(result);
        // Get deck id
        if (result) {
            Deck.findOne({ name: deckName, userId: result._id }).exec(function (err, result2) {
                if (err) {
                    return console.error(err);
                }
                
                // Add card to deck
                if (result2) {
                    DeckCard.create({ cardName: cardName, deckId: result2._id }, function (err, result) {
                        if (err) {
                            return console.error(err);
                        }
                        
                        // Success!
                        console.log("Added card to deck.");
                        res.end();
                    });
                }
            });
        }
    });
});

app.post('/removeCardFromDeck', function(req, res) {
    // Set up data
    var data = req.body;
    var userName = data.userName,
        deckName = data.deckName,
        cardName = data.cardName;
    
    // Get user id
    User.findOne({userName: userName}).exec(function (err, result) {
        if (err) {
            return console.error(err);
        }
        // Get deck id
        if (result) {
            Deck.findOne({ name: deckName, userId: result._id }).exec(function (err, result2) {
                if (err) {
                    return console.error(err);
                }
                // Remove card from deck
                if (result2) {
                    DeckCard.remove({ cardName: cardName, deckId: result2._id }, function (err, result) {
                        if (err) {
                            return console.error(err);
                        }
                        
                        // Success!
                        res.send();
                    });
                }
            });
        }
    });
});

app.post('/getUserDecks', function(req, res) {
    // Set up data
    var userName = req.body.userName;
    
    User.findOne({ userName: userName }).exec(function (err, result) {
        if (err) {
            console.error(err);
        }
        
        if (result) {
            Deck.find({ userId: result._id }).exec(function (err, results) {
                if (err) {
                    return console.error(err);
                }
                // Handle decks
                var decks = {};
                for (var i = 0; i < results.length; i++) {
                    // Create result variable
                    var deckName = results[i].name;
                    decks[deckName] = [];
                    
                    // Handle all cards in deck
                    DeckCard.find({ deckId: results[i]._id }).exec(function (err, deckCards) {
                        if (err) {
                            return console.error(err);
                        } else if (deckCards) {
                            
                            // Push all the cards to the currect deck property array
                            for (var j = 0; j < deckCards.length; j++) {
                                decks[deckName].push({ "cardName": deckCards[j].cardName });
                            }
                        }
                        
                        // Return results (fix for callback sync)
                        if (i >= results.length - 1) {
                            // Return results.
                            console.log(decks);
                            return res.json(decks);
                        }
                    });
                }
                
                
            });
        }
    });
    
    /*
        PHP
        
        $return = array();
        while ($row = $result->fetch_assoc()) {
            $id = $row["id"];
            $deckname = $row["name"];
            $cardName = $row["cardName"];
            $quantity = $row["quantity"];
            if (!array_key_exists($deckname, $return)) {
                $return[$deckname] = array();
            }
            if ($cardName != null && $quantity != null) {
                array_push($return[$deckname], array("cardName"=>$cardName, "quantity"=>$quantity));
            }
        }
    */
});

app.post('/registerUser', function(req, res) {
    // Set up data
    var data = req.body;
    var userName = data.userName,
        fname = data.fname,
        lname = data.lname,
        email = data.email,
        country = data.country;
    
    User.create({ 
        userName: userName,
        name: {
            first: fname,
            last: lname
        },
        email: email,
        country: country
    }, function (err, result) {
        if (err) {
            return console.error(err);
        }
        
        console.log("User: " + userName + " created successfully!");
        res.send();
    });
});

/*
    %%%%%%%%%%%%%%%%%%%%%%%%
        Server (cont.)
    %%%%%%%%%%%%%%%%%%%%%%%%
*/
// Handle 404 errors
app.use(function(req, res, next) {
  res.status(404).send('404: Sorry! I cannot be found...');
});

// Spin up server on port & listen
app.listen(process.env.PORT || 5000, function () {
  console.log('Server started! ' + new Date().toTimeString());
});


