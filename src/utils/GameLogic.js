import {shuffle, reshape, flatten} from './Utilities.js';
import {range} from 'lodash';

const Directions = {
    ACROSS: 0,
    DOWN: 1
}

function createLevel(difficulty, symbols) {
    return range(0, difficulty).map(index => symbols ? range(0, difficulty).map(item => `${item.toString()}-${index.toString()}`) : range(0, difficulty).map(item => `${item}`));
}


function randomizeStructure(structure){
    let oneDStrucure = flatten(structure);
    const suffledStructure = shuffle(oneDStrucure);
    let reshapedStucture = reshape(suffledStructure, structure[0].length);
    return reshapedStucture;
    
}
function getPiecesByProperty(pieces, property, value){
    let matches = [];
    for(let i = 0; i < pieces.length; i++){
        if(pieces[i][property] == value){
            matches.push(pieces[i]);
        }
    }
    return matches;
}

function checkForWin(structure, symbols){
    if(symbols) {
        const flattenedStructure = flatten(structure);
        const param1Check = checkForWin(reshape(flattenedStructure.map(item => item.split('-')[0]), structure.length));
        const param2Check = checkForWin(reshape(flattenedStructure.map(item => item.split('-')[1]), structure.length));
        return param1Check && param2Check;
    }
    else {
        const rFiltered = structure.map(row => row.filter(item => item == row[0]).length);
        const rowsList = rFiltered.filter(item => item === structure.length);
        if(rowsList.length === structure.length){
            return true;
        }
        return structure.filter(item => item.join(',') === structure[0].join(',')).length === structure.length;
    }
}

export {getPiecesByProperty, randomizeStructure, Directions, createLevel, checkForWin};