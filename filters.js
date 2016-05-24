// Export functionallity.
exports.filterByName = filterByName;
exports.filterByPower = filterByPower;
exports.filterByToughness = filterByToughness;
exports.filterByManaCost = filterByManaCost;
exports.filterByManaColor = filterByManaColor;

// Filter passed-in cards by name, and return result.
function filterByName ( data, name ) {
    var tempData = [];

    for (var i = 0; i < data.length; i++) {
        if (data[i].name.toLowerCase().includes(name.toLowerCase())) {
            tempData.push(data[i]);
        }
    }

    return tempData;
}

// Filter passed-in cards by power, and return result.
function filterByPower ( data, power ) {
    var tempData = [];
    
    for (var i = 0; i < data.length; i++) {
        if (data[i].power) {
            if (data[i].power == power) {
                tempData.push(data[i]);
            }
        }
    }

    return tempData;
}

// Filter passed-in cards by toughness, and return result.
function filterByToughness ( data, toughness ) {
    var tempData = [];

    for (var i = 0; i < data.length; i++) {
        if (data[i].toughness == toughness) {
            tempData.push(data[i]);
        }
    }

    return tempData;
}

// Filter passed-in cards by mana cost, and return result.
function filterByManaCost ( data, manaCost ) {
    var tempData = [];

    for (var i = 0; i < data.length; i++) {
        var totalCost = 0;
        if (data[i].manaCost) {
            var chars = data[i].manaCost.split("");
            for (var j = 0; j < chars.length; j++) {
                if (!isNaN(chars[j])) {
                    totalCost += Number(chars[j] - 1);
                } else if (chars[j] == "{") {
                    totalCost++;
                }
            }
        }

        if (totalCost == manaCost) {
            tempData.push(data[i]);
        }
    }

    return tempData;
}

// Filter passed-in cards by mana color, and return result.
function filterByManaColor ( data, color ) {
    var tempData = [];

    for (var i = 0; i < data.length; i++) {
        if (data[i].colors) {
            for (var j = 0; j < data[i].colors.length; j++) {
                if (data[i].colors[j].toLowerCase() == color.toLowerCase()) {
                    tempData.push(data[i]);
                    break;
                }
            }
        }
    }

    return tempData;
}