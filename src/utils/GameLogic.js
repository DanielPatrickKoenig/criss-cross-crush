import {shuffle, reshape, flatten, transposeAxis} from './Utilities.js';
import {range, uniq} from 'lodash';

const Directions = {
    ACROSS: 0,
    DOWN: 1
}

const patterns = [
    [
        [true, false], 
        [false, true]
    ],
    [
        [false, true], 
        [true, false]
    ],
    [
        [true, false], 
        [true, true]
    ],
    [
        [true, true], 
        [true, true]
    ],
    [
        [true, true, true], 
        [true, true, false]
    ],
    [
        [true, true, true], 
        [false, true, true]
    ],
    [
        [false, true, true], 
        [true, true, true]
    ],
    [
        [true, true, false], 
        [true, true, true]
    ],
    [
        [false, true, false], 
        [true, true, true]
    ],
    [
        [true, false, true], 
        [true, true, true]
    ],
    [
        [true, true, true], 
        [true, true, true]
    ],
    [
        [true, true, true], 
        [true, true, true], 
        [true, true, true]
    ],
    [
        [true, true, true], 
        [true, false, true], 
        [true, true, true]
    ],
    [
        [true, false, true], 
        [true, true, true], 
        [true, true, true]
    ],
    [
        [true, false, true], 
        [true, false, true], 
        [true, true, true]
    ],
    [
        [false, false, true], 
        [false, false, true], 
        [true, true, true]
    ],
    [
        [true, false, false], 
        [true, false, false], 
        [true, true, true]
    ],
    [
        [true, false, false], 
        [true, true, false], 
        [true, true, true]
    ],
    [
        [false, false, true], 
        [true, true, false], 
        [true, true, true]
    ]
]

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

function rowCheck(structure, row, slots, offset){
    let maxFill = offset + slots.length;
    if(maxFill > structure.length){
        return false;
    }
    let newRow = structure[row];
    for(let i = offset; i < slots.length + offset; i++){
        if(!newRow[i] && slots[i - offset]){
            return false;
        }
        
    }
    return newRow;
}

function patternMatch(structure, patternRows, row, column){
    // let checks = []
    if(patternRows.length + row > structure.length){
        return false;
    }
    for(let i = 0; i < patternRows.length; i++){
        const check = rowCheck(structure, row + i, patternRows[i], column);
        if(!check){
            return false
        }
    }
    return true;
}

function findPattern(pattern, structure, value){
    const remappedStructure = structure.map(row => row.map(item => item === value));
    let targetCells = [];
    let matchMatrix = [];
    // const patternWidth = pattern[0].length;
    // const patternHeight = pattern.length;
    for(let i = 0; i < remappedStructure.length; i++){
        matchMatrix.push([])
        for(let j = 0; j < remappedStructure[i].length; j++){
            if(patternMatch(remappedStructure, pattern, i, j)){
                targetCells.push(cellsToRemove(i, j, pattern));
            }
            matchMatrix[i].push(patternMatch(remappedStructure, pattern, i, j));
        }
    }
    return targetCells;
}

function cellsToRemove(row, column, pattern){
    let targetCells = [];
    for(let i = 0; i < pattern.length; i++){
        for(let j = 0; j < pattern[i].length; j++){
            if(pattern[i][j]){
                targetCells.push({row: i + row, column: j + column});
            }
        }
    }
    return targetCells;
}

function scanBoard(pattern, structure, level){
    const list = flatten(flatten([...Array(level).keys()].map(item => findPattern(pattern, structure, item.toString()))));
    return uniq(list.map(item => JSON.stringify(item))).map(item => JSON.parse(item));
}

function shouldRemoveBlock(targetedBlocks, row, column){
    return targetedBlocks.filter(item => item.row === row && item.column === column).length > 0;
}

function getDropMatrix(targetedBlocks, structure){
    let dropTracker = [...Array(structure.length).keys()].map(item => item * 0);
    let dropMatrix = [];
    for(let i = 0; i < structure.length; i++){
        // dropMatrix.push([]);
        let matrixRow = [];
        for(let j = structure[i].length - 1; j >=  0; j--) {
            const shouldRemove = shouldRemoveBlock(targetedBlocks, j, i);
            if(shouldRemove){
                dropTracker[i]++;
            }
            matrixRow.push(shouldRemove ? -1 : dropTracker[i]);
        }
        // if(matrixRow[matrixRow.length - 1] === -1){
        //     console.log(matrixRow.join(',').split('-1'));
        //     matrixRow[matrixRow.length - 1] = matrixRow.join(',').split('-1').length - 1;
        // }
        let filteredMatrixRow = matrixRow.filter(item => item !== -1);
        const startDiff = structure.length - filteredMatrixRow.length;
        for(let j = 0; j < structure.length; j++){
            if(filteredMatrixRow.length <= j){
                filteredMatrixRow.push(((startDiff + 1) - (structure.length - filteredMatrixRow.length)) * -1);
            }
        }
        filteredMatrixRow.reverse();
        dropMatrix.push(filteredMatrixRow);
    }
    return transposeAxis(dropMatrix);
}

function updatedBoard(targetedBlocks, structure){
    let transposed = transposeAxis(structure);
    const dropMatrix = getDropMatrix(targetedBlocks, transposed);
    let filteredTransposed = transposed.map((item1, index1) => item1.filter((item2, index2) => !shouldRemoveBlock(targetedBlocks, index2, index1)));
    let removals = filteredTransposed.map(item => structure.length - item.length);
    for (let i = 0; i < removals.length; i++) {
        for(let j = 0; j < removals[i]; j++) {
            filteredTransposed[i].splice(0, 0, Math.floor(Math.random() * removals.length).toString());
        }
    }
    return {updatedStructure: transposeAxis(filteredTransposed), dropMatrix};
}

export {getPiecesByProperty, randomizeStructure, Directions, createLevel, checkForWin, scanBoard, updatedBoard, patterns};