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
            if(result) { //if result is not undefined, then element found. Loop can now end
                this.positionOfEmpty = [y, result];
                break; //end the loop
            }
        }
        this.matrixOfPuzzle = tempMatrix; //update puzzle matrix to throwaway matrix
    };
    this.getElementAboveEmpty = function() {
        let checkRow = this.positionOfEmpty[0]-1;
        let checkColumn = this.positionOfEmpty[1];
        return this.matrixOfPuzzle[checkRow, checkColumn];
    };

    this.getElementBelowEmpty = function() {
        let checkRow = this.positionOfEmpty[0]+1;
        let checkColumn = this.positionOfEmpty[1];
        return this.matrixOfPuzzle[checkRow, checkColumn];
    };

    this.getElementRightEmpty = function() {
        let checkRow = this.positionOfEmpty[0];
        let checkColumn = this.positionOfEmpty[1]+1;
        return this.matrixOfPuzzle[checkRow, checkColumn];
    };

    this.getElementLeftEmpty = function() {
        let checkRow = this.positionOfEmpty[0]-1;
        let checkColumn = this.positionOfEmpty[1]-1;
        return this.matrixOfPuzzle[checkRow, checkColumn];
    };
    this.swapCells = function(cell) {
        let clickedParent = jQuery(cell).parent();
        let emptyParent = jQuery('#empty').parent();
        clickedParent.append(jQuery('#empty'));
        emptyParent.append(jQuery(cell));
        jQuery(cell).remove();
        jQuery(emptyParent.children('#empty')).remove();
        this.refreshMatrix();
    }
};

var theGame = new Display('puzzle'); //id of div in this case is puzzle
theGame.refreshMatrix();
console.log(theGame.matrixOfPuzzle); //diagnostic
jQuery('td').click(function() {
    console.log('Clicked');
    if(parseInt(theGame.getElementAboveEmpty()) === parseInt(jQuery(this).html())) { //parse int and === are used to make sure the type compared is an int
        theGame.swapCells(this);
    } else if(parseInt(theGame.getElementBelowEmpty()) === parseInt(jQuery(this).html())) {
        theGame.swapCells(this);
    } else if(parseInt(theGame.getElementRightEmpty()) === parseInt(jQuery(this).html())) {
        theGame.swapCells(this);
    } else if(parseInt(theGame.getElementLeftEmpty()) === parseInt(jQuery(this).html())) {
        theGame.swapCells(this);
    } else {
        //nothing changes, because clicked cell is not adjacent to an empty cell
    }
});
