<?php 

/*
    Created by: Dakota Kronberger
    Adds a card to your database.
    5/15/2016
*/

$deckname = $_POST["deckName"];
$cardname = $_POST["cardName"];
$quantity = $_POST["quantity"];
$ownsDeck = false;
$deckId = 0;

$DBservername = "localhost";
$DBusername = "magicuser";
$DBpassword = "magicuser1";
$DBname = "magic_site";
$username = $_POST["username"];

// Create connection
$conn = new mysqli($DBservername, $DBusername, $DBpassword, $DBname);
if ($conn->connect_error) {
    die("Connection failed. " . $conn->connect_error);
} 

// Main Functions

// Get user Id, based on passed-in username
$stmt = $conn->prepare("SELECT deck.name, deck.id FROM user INNER JOIN deck ON deck.userId = user.id WHERE username = ?"); 
$stmt->bind_param('s', $username);
$stmt->execute();

$result = $stmt->get_result();
while ($row = $result->fetch_assoc()) {
    if ($row["name"] == $deckname) {
        $ownsDeck = true;
        $deckId = $row["id"];
        break;
    }
} 

if ($ownsDeck == true) {
    $stmt = $conn->prepare("INSERT INTO deckcards (deckId, cardName, quantity) VALUES ( ? , ? , ? )"); 
    $stmt->bind_param('isi', $deckId, $cardname, $quantity);
    $stmt->execute();

    $result = $stmt->get_result();
} else {
    die("User cannot add this card, does not own deck.");
}

// Close connection 
$conn = null;

// Return data
echo "Success";

?>