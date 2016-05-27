/*
    Creates a server, that serves up local static files.
    Created by: Dakota Kronberger
*/
var cardData = require("./data/AllCards.json")
var imageData = require("./data/imageurls.json")
var filters = require("./filters");

/*
    SERVER
*/
var express = require("express");
var app = express();

app.use(express.static('www'));

app.listen(process.env.PORT || 5000, function () {
  console.log('Server started! ' + new Date().toTimeString());
});


/*
    CARD API
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

/*
    MongoDB classes/functions
*/

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.connect('mongodb://mtguser:counter480@ds039185.mlab.com:39185/mtg');


// Schemas
var DeckSchema = new Schema({
    name: String,
    userId  : { type: ObjectId, ref: 'UserSchema' }
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
    deckId: { type: ObjectId, ref: 'DeckSchema' }
}); // end schemas

// Models
var Deck = mongoose.model("Deck", DeckSchema);
var User = mongoose.model("User", UserSchema);
var DeckCard = mongoose.model("DeckCard", DeckCardSchema); // end models

// Functions


// Handle 404 errors
app.use(function(req, res, next) {
  res.status(404).send('404: Sorry! I cannot be found...');
});


