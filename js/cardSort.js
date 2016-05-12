var cardJSON

function getJSON() {
    $.getJSON("json/SOI-x.json", function (data) {
        var items = [];
        var cards = [];
        var count = 0;
        $(data.cards).each(function () {
            var cardInput = document.getElementById("cardName");
            $("#cards").append("<h1>Naame:"+this.name+"</h1><br>");
            $("#cards").append("Mana Cost: " + this.manaCost + "<br>");
            $("#cards").append("Power: " + this.power + "<br>");
            $("#cards").append("Toughness :" + this.toughness + "<br><br>");
            if(this.manaCost != undefined || this.mana != null)
            {
            var mana = this.manaCost
            $("#cards").append("<img src="+mana+'">');    
            }

        });
    });
}