<?php

/*
    Created by: Dakota Kronberger
    Returns an array of cards that you own.
    5/15/2016
*/

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
$stmt = $conn->prepare("SELECT id FROM user WHERE username = ?"); 
$stmt->bind_param('s', $username);
$stmt->execute();

$result = $stmt->get_result();
if ($row = $result->fetch_assoc()) {
    $userid = $row["id"];
} 

// Get all deck cards that correspond to your user Id
$stmt = $conn->prepare("SELECT d.id, d.name, dc.cardName, dc.quantity FROM deck d LEFT JOIN deckcards dc ON d.id = dc.deckId WHERE userId = ?"); 
$stmt->bind_param('s', $userid);
$stmt->execute();

$result = $stmt->get_result();
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

// Close connection 
$conn = null;

// Return data
echo json_encode($return)
    
?>