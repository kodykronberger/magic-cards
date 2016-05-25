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

app.use(function(req, res, next) {
  res.status(404).send('404: Sorry! I cannot be found...');
});

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

/*
    MONGODB OPERATIONS
*/

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://mtguser:counter480@ds039185.mlab.com:39185/mtg';

function getDb(dbUrl) {
    MongoClient.connect(dbUrl, function(err, db) {
        console.log(err);
        assert.equal(null, err);
        return db;
    });
}

var database = {
    users: {
        insert: function (userName, fname, lname, email, country, next) {
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection('user').insertOne({
                    userName: userName,
                    name: {
                        first: fname,
                        last: lname
                    },
                    email: email,
                    country: country
                }, function (err, result) {
                    assert.equal(err, null);
                    console.log("Inserted a document into the users collection: " + userName);
                    next();
                });
            });
        },
        find: function (userName, next) {
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                var cursor = db.collection('user').find({
                    "userName": userName
                });
                cursor.each(function (err, doc) {
                    assert.equal(err, null);
                    if (doc != null) {
                        return next(doc);
                    }
                });
            });
        },
        delete: function (userName) {
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection('user').deleteOne({
                    "userName": userName
                }, function (err, results) {
                    assert.equal(err, null);
                    console.log("Deleted a document into the users collection: " + userName);
                });
            });
        }
    },
    decks: {
        insert: function (userId, deckName, next ) {
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection('deck').insertOne({
                    userId: userId,
                    deckName: deckName
                }, function (err, result) {
                    assert.equal(err, null);
                    console.log("Inserted a document into the decks collection: " + deckName);
                    next();
                });
            });
        },
        find: function (deckName, userId, next) {
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                var cursor = db.collection('deck').find({
                    "deckName": deckName, 
                    "userId": userId
                });
                cursor.each(function (err, doc) {
                    assert.equal(err, null);
                    if (doc != null) {
                        return next(doc);
                    }
                });
            });
        },
        delete: function (deckName, userId) {
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection('deck').deleteOne({
                    "deckName": deckName, 
                    "userId": userId
                }, function (err, results) {
                    assert.equal(err, null);
                    console.log("Deleted a document from the decks collection: " + deckName);
                });
            });
        }
    },
    deckCards: {
        insert: function (deckId, cardName, next) {
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection('deckCards').insertOne({
                    "deckId": deckId, 
                    "cardName": userId
                }, function (err, result) {
                    assert.equal(err, null);
                    console.log("Inserted a document into the deckCards collection: " + cardName + ": q=" + deckId);
                    next();
                });
            });
        },
        find: function (deckId, cardName, next) {
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                var cursor = db.collection('deckCards').find({
                    "deckId": deckId,
                    "cardName": cardName
                });
                cursor.each(function (err, doc) {
                    assert.equal(err, null);
                    if (doc != null) {
                        return next(doc);
                    }
                });
            });
        },
        delete: function (deckId, cardName) {
            MongoClient.connect(url, function (err, db) {
                assert.equal(null, err);
                db.collection('deckCards').deleteOne({
                    "deckId": deckId,
                    "cardName": cardName
                }, function (err, results) {
                    assert.equal(err, null);
                    console.log("Deleted a document into the users collection: " + userName);
                });
            });
        }
    }
}

function testDatabase() {
    database.users.insert("testUser", "Bob", "Test", "bobtest@yahoo.com", "USA", function() {
        console.log("1");
        database.users.find("testUser", function ( user ) {
            database.decks.insert(user._id, "Test Deck 1", function() {
                console.log("2");
                database.users.find("testUser", function ( user ) {
                    database.decks.find("Test Deck 1", user._id, function( deck ) {
                        database.deckCards.insert(deck._id, "Thunder Strike", function() {
                            console.log("3");
                        });
                    });
                });
            });
        });
    });
}

testDatabase();

