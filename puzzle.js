var Display = function(puzzle) { //expects a string for the id of the puzzle div
    this.puzzleID = puzzle;
    this.tableID = jQuery('#puzzle > table');
    this.numberOfColumns = jQuery('#row1').children().length;
    this.numberOfRows = jQuery('tr').length;
    this.matrixOfPuzzle = new Array(this.numberOfRows);
    this.refreshMatrix = function() {
        let pieces = jQuery('td');
        let currentColumn = 0;
        let currentRow = 0;
        pieces.each(function(index){
            if(!(currentColumn < this.numberOfColumns)) {
                currentColumn = 0;
                currentRow++;
            }
            this.matrixOfPuzzle[currentRow][currentColumn] = parseInt(this.html());
            currentColumn++;
        });
    }
};

var theGame = new Display('puzzle')

jQuery('td').click(function() {

});
