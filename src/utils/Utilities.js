function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}
function flatten(list){
    let oneDStrucure = [];
    for(let i = 0; i < list.length; i++){
        for(let j = 0; j < list[i].length; j++){
            oneDStrucure.push(list[i][j]);
        }
    }
    return oneDStrucure;
}
function reshape(list, width){
    let reshapedStucture = [];
    let colIndex = 0;
    for(var i = 0; i < list.length; i++){
        if(colIndex == 0){
            reshapedStucture.push([]);
        }
        reshapedStucture[reshapedStucture.length-1].push(list[i]);
        colIndex++;
        if(colIndex >= width){
            colIndex = 0;
        }
    }
    return reshapedStucture;
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}
export {shuffle, reshape, getParameterByName, flatten};