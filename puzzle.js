var Display = function(puzzle) { //expects a string for the id of the puzzle div
    this.puzzleID = puzzle;
    this.tableID = jQuery('#puzzle > table');
    this.numberOfColumns = jQuery('#row1').children().length;
    this.numberOfRows = jQuery('tr').length;
    this.matrixOfPuzzle = new Array(this.numberOfRows);
    this.positionOfEmpty = [];
    this.isNull = function(cell) {
        return cell === '';
    }
    this.refreshMatrix = function() {
        let pieces = jQuery('td');
        console.log(pieces); //diagnostic
        let index = 0;
        let tempMatrix = new Array(this.numberOfRows);
        for(let y = 0; y < this.numberOfRows; y++) { //update values of every cell in puzzle
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
                console.log(this.positionOfEmpty);
                break; //end the loop
            }
        }
        this.matrixOfPuzzle = tempMatrix; //update puzzle matrix to throwaway matrix
    };
    this.getElementAboveEmpty = function() {
        console.log('AboveEmpty');
        let checkRow = this.positionOfEmpty[0]-1;
        let checkColumn = this.positionOfEmpty[1];
        try {
            return this.matrixOfPuzzle[checkRow][checkColumn];
        } catch(error) {
            return undefined;
        }
    };

    this.getElementBelowEmpty = function() {
        console.log('BelowEmpty');
        let checkRow = this.positionOfEmpty[0]+1;
        let checkColumn = this.positionOfEmpty[1];
        try {
            return this.matrixOfPuzzle[checkRow][checkColumn];
        } catch(error) {
            return undefined;
        }
    };

    this.getElementRightEmpty = function() {
        console.log('RightEmpty');
        let checkRow = this.positionOfEmpty[0];
        let checkColumn = this.positionOfEmpty[1]+1;
        try {
            return this.matrixOfPuzzle[checkRow][checkColumn];
        } catch(error) {
            return undefined;
        }
    };

    this.getElementLeftEmpty = function() {
        console.log('LeftEmpty');
        let checkRow = this.positionOfEmpty[0];
        let checkColumn = this.positionOfEmpty[1]-1;
        try {
            return this.matrixOfPuzzle[checkRow][checkColumn];
        } catch(error) {
            return undefined;
        }
    };
    this.swapVerticalCells = function(cell) {
        console.log('SwapCells');
        let clickedParent = jQuery('#'+cell).parent();
        let emptyParent = jQuery('#empty').parent();
        jQuery(clickedParent).prepend('<span id="tmpClicked"></span>');
        jQuery(emptyParent).prepend('<span id="tmpEmpty"></span>');
        jQuery('#tmpClicked').insertAfter(jQuery('#'+cell));
        jQuery('#tmpEmpty').insertAfter(jQuery('#empty'));
        jQuery('#empty').insertAfter(jQuery('#tmpClicked'));
        jQuery('#'+cell).insertAfter(jQuery('#tmpEmpty'));
        jQuery('#tmpClicked').remove();
        jQuery('#tmpEmpty').remove();
        this.refreshMatrix();
    }


};

var theGame = new Display('puzzle'); //id of div in this case is puzzle
theGame.refreshMatrix();
console.log(theGame.matrixOfPuzzle); //diagnostic
jQuery('td').click(function() {
    console.log('Clicked');
    let id = jQuery(this).attr('id');
    if(parseInt(theGame.getElementAboveEmpty()) === parseInt(jQuery(this).html())) { //parse int and === are used to make sure the type compared is an int
        theGame.swapVerticalCells(id);
    } else if(parseInt(theGame.getElementBelowEmpty()) === parseInt(jQuery(this).html())) {
        theGame.swapVerticalCells(id);
    } else if(parseInt(theGame.getElementRightEmpty()) === parseInt(jQuery(this).html())) {
        jQuery(this).insertBefore(jQuery('#empty'));
        theGame.refreshMatrix();
    } else if(parseInt(theGame.getElementLeftEmpty()) === parseInt(jQuery(this).html())) {
        jQuery(this).insertAfter(jQuery('#empty'));
        theGame.refreshMatrix();
    } else {
        console.log('Else');
        //nothing changes, because clicked cell is not adjacent to an empty cell
    }
});
