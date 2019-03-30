//Puzzle Project by Jonathan Stine
//All code with the exception of getRandomInt was created from scratch

var Display = function(puzzle) { //expects a string for the id of the puzzle div
    this.puzzleID = puzzle;
    this.tableID = jQuery('#puzzle > table');
    this.numberOfColumns = jQuery('#row1').children().length;
    this.numberOfRows = jQuery('tr').length;
    this.matrixOfPuzzle = new Array(this.numberOfRows);
    this.oneDMatrixOfPuzzle = new Array(this.numberOfRows*this.numberOfColumns);
    this.positionOfEmpty = [];
    this.isNull = function(cell) {
        return cell === '0';
    };

    //getRandomInt was taken from the mozilla javascript docs, found here:
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
    this.getRandomInt = function(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    };

    this.checkValidity = function() { //checks validity of puzzle. Should be reusable for any size
        let inversions = 0;
        let index = 0;
        while(index < this.oneDMatrixOfPuzzle.length-1) {
            for (let i = index+1; i < this.oneDMatrixOfPuzzle.length; i++) {
                //console.log(parseInt(this.oneDMatrixOfPuzzle[index]));
                //console.log(parseInt(this.oneDMatrixOfPuzzle[i]));
                if (parseInt(this.oneDMatrixOfPuzzle[index]) > parseInt(this.oneDMatrixOfPuzzle[i])) {
                    //console.log('greater');
                    if(parseInt(this.oneDMatrixOfPuzzle[index]) === 0 || parseInt(this.oneDMatrixOfPuzzle[i]) === 0) { // make sure empty space isn't being tested
                        //console.log('nothing');
                    } else {
                        inversions++;
                    }
                }
            }
            index++;
        }
        console.log(inversions);
        if((4-this.positionOfEmpty[0]) % 2 === 0) { //empty is in even row, inversions should be odd
            if(inversions % 2 === 0) {
                return false;
            } else {
                return true; //not divisible by two, therefore odd and valid
            }
        } else { //empty is in odd row, inversions should be even
            if(inversions % 2 === 0) {
                return true; //divisible by two, therefore even and valid
            } else {
                return false;
            }
        }

    };
    this.checkIfWon = function(){
        let wrongOrder = false;
        for(let i = 0; i < this.oneDMatrixOfPuzzle.length-1; i++) {
            if(parseInt(this.oneDMatrixOfPuzzle[i]) === i+1) {
                console.log('continue');
            } else {
                wrongOrder = true;
            }
        }
        if(wrongOrder === false) {
            alert('You solved the puzzle!!!');
        }
    };
    this.refreshMatrix = function() {
        let pieces = jQuery('td');
        //console.log(pieces); //diagnostic
        let index = 0;
        let tempMatrix = new Array(this.numberOfRows);

        for(let i = 0; i < pieces.length; i++) { //update values of every cell in puzzle to 1d array
            this.oneDMatrixOfPuzzle[i] = jQuery(pieces[i]).html();
        }

        for(let y = 0; y < this.numberOfRows; y++) { //update values of every cell in puzzle to 2d array
            let tempArray = new Array(this.numberOfColumns); //temp array for each row
            for(let x = 0; x < this.numberOfColumns; x++) {
                tempArray[x] = jQuery(pieces[index]).html(); //add column to row (only the number in the td element)
                index++;
            }
            tempMatrix[y] = tempArray; //add row to throwaway matrix
        }
        for(let y = 0; y < this.numberOfRows; y++) { //update position of empty
            let tempArray = tempMatrix[y]; //store current row
            let result = tempArray.findIndex(this.isNull); //check current stored row
            if(result > -1) { //if result is not undefined, then element found. Loop can now end
                this.positionOfEmpty = [y, result];
                //console.log(this.positionOfEmpty);
                break; //end the loop
            }
        }
        this.matrixOfPuzzle = tempMatrix; //update puzzle matrix to throwaway matrix
        //this.checkIfWon();
    };
    this.getElementAboveEmpty = function() {
        //console.log('AboveEmpty');
        let checkRow = this.positionOfEmpty[0]-1;
        let checkColumn = this.positionOfEmpty[1];
        try {
            return this.matrixOfPuzzle[checkRow][checkColumn];
        } catch(error) {
            return undefined;
        }
    };

    this.getElementBelowEmpty = function() {
        //console.log('BelowEmpty');
        let checkRow = this.positionOfEmpty[0]+1;
        let checkColumn = this.positionOfEmpty[1];
        try {
            return this.matrixOfPuzzle[checkRow][checkColumn];
        } catch(error) {
            return undefined;
        }
    };

    this.getElementRightEmpty = function() {
        //console.log('RightEmpty');
        let checkRow = this.positionOfEmpty[0];
        let checkColumn = this.positionOfEmpty[1]+1;
        try {
            return this.matrixOfPuzzle[checkRow][checkColumn];
        } catch(error) {
            return undefined;
        }
    };

    this.getElementLeftEmpty = function() {
        //console.log('LeftEmpty');
        let checkRow = this.positionOfEmpty[0];
        let checkColumn = this.positionOfEmpty[1]-1;
        try {
            return this.matrixOfPuzzle[checkRow][checkColumn];
        } catch(error) {
            return undefined;
        }
    };
    this.swapCells = function(cellFirst, cellSecond) {
        //console.log('SwapCells');
        let clickedParent = jQuery('#'+cellFirst).parent();
        let emptyParent = jQuery('#'+cellSecond).parent();
        jQuery(clickedParent).prepend('<span id="tmpClicked"></span>');
        jQuery(emptyParent).prepend('<span id="tmpEmpty"></span>');
        jQuery('#tmpClicked').insertAfter(jQuery('#'+cellFirst));
        jQuery('#tmpEmpty').insertAfter(jQuery('#'+cellSecond));
        jQuery('#'+cellSecond).insertAfter(jQuery('#tmpClicked'));
        jQuery('#'+cellFirst).insertAfter(jQuery('#tmpEmpty'));
        jQuery('#tmpClicked').remove();
        jQuery('#tmpEmpty').remove();
    };
    this.randomize = function() {
        for(let i = 0; i < 200; i++) {
            let first = jQuery('#' + this.getRandomInt(0, 17));
            let second = jQuery('#' + this.getRandomInt(0, 17));
            while (first === second) { //prevent the same elements being selected
                second = jQuery('#' + getRandomInt(0, 16));
            }
            this.swapCells(first.html(), second.html());
        }
        this.refreshMatrix();
    };

    this.winTheGame = function() { //diagnostic function
        jQuery('table').replaceWith('        <table id = \'board\'>\n' +
            '            <tr id="row1">\n' +
            '                <td id="1">1</td>\n' +
            '                <td id="2">2</td>\n' +
            '                <td id="3">3</td>\n' +
            '                <td id="4">4</td>\n' +
            '            </tr>\n' +
            '            <tr id="row2">\n' +
            '                <td id="5">5</td>\n' +
            '                <td id="6">6</td>\n' +
            '                <td id="7">7</td>\n' +
            '                <td id="8">8</td>\n' +
            '            </tr>\n' +
            '            <tr id="row3">\n' +
            '                <td id="9">9</td>\n' +
            '                <td id="10">10</td>\n' +
            '                <td id="11">11</td>\n' +
            '                <td id="12">12</td>\n' +
            '            </tr>\n' +
            '            <tr id="row4">\n' +
            '                <td id="13">13</td>\n' +
            '                <td id="14">14</td>\n' +
            '                <td id="15">15</td>\n' +
            '                <td class=\'empty\' id="0">0</td>\n' +
            '            </tr>\n' +
            '        </table>');
    };

};

var theGame = new Display('puzzle'); //id of div in this case is puzzle
theGame.refreshMatrix();
theGame.randomize(); //new game
console.log(theGame.matrixOfPuzzle); //diagnostic
jQuery('td').click(function() {
    console.log('Clicked');
    let id = jQuery(this).attr('id');
    if(parseInt(theGame.getElementAboveEmpty()) === parseInt(jQuery(this).html())) { //parse int and === are used to make sure the type compared is an int
        theGame.swapCells(id, '0');
    } else if(parseInt(theGame.getElementBelowEmpty()) === parseInt(jQuery(this).html())) {
        theGame.swapCells(id, '0');
    } else if(parseInt(theGame.getElementRightEmpty()) === parseInt(jQuery(this).html())) {
        jQuery(this).insertBefore(jQuery('#0'));
        //theGame.refreshMatrix();
    } else if(parseInt(theGame.getElementLeftEmpty()) === parseInt(jQuery(this).html())) {
        jQuery(this).insertAfter(jQuery('#0'));
        //theGame.refreshMatrix();
    } else {
        console.log('Else');
        //nothing changes, because clicked cell is not adjacent to an empty cell
    }
    theGame.refreshMatrix();
    theGame.checkIfWon();
    //console.log(theGame.checkValidity());
});

jQuery('#randomize').click(function() {
    jQuery('#randomize').val('Randomizing...');
    setTimeout(function(){},100);
    theGame.randomize();
    while(theGame.checkValidity() === false) {
        theGame.randomize();
    }
    jQuery(this).val('Randomize!');
});

console.log(theGame.checkValidity());
