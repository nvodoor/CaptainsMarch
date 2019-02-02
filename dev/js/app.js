/*!
 * Connect Four game application
 */
 new Vue({
   el: '#game',
   data: {
      board: [],
      columnCount: 7,
      rowCount: 6,
      playerTurn: 1,
      winner: false
   },
   
   beforeMount() {
      this.resetGame();
   },
   
   methods: {
      resetGame: function() {
         // Empty board
         this.board = [];
         
         var emptyColumn = [];
         for(var y = 0; y < this.rowCount; y++){
            emptyColumn[y] = 0;
         }
         
         // Push columns with empty values
         for(var x = 0; x < this.columnCount; x++) { 
            this.board.push(emptyColumn.slice(0));
         }
         
         var pieces = document.getElementsByClassName('piece');
         
         // Reset pieces
         for(var x = 0; x < pieces.length; x++) {
            pieces[x].className = 'piece';
         }
         
         this.playerTurn=1;
      },

      addComputerPiece() {
              let col = Math.floor(Math.random() * this.columnCount);

              let column = document.getElementsByClassName('column')[col];

              const spot = this.getOpenSpotInColumn(col);

              if (spot === null) {
                  // done to ensure computer tries again
                  this.addComputerPiece();
                  return;
              }

              this.board[spot.column][spot.row] = this.playerTurn;
              column.children[spot.row].children[0].classList.add(this.playerTurn === 1 ? "red" : "blue");
              
              this.checkWinner(spot.row, spot.column)

              this.playerTurn = 1;

      },
      checkWinner(row, col) {

          const horizontal = this.checkHorizontal(row);
          const vertical = this.checkVertical(col);
          const major = this.checkMajor(row, col);
          const minor = this.checkMinor(row, col);

          if (horizontal || vertical || major || minor) {
              this.winner = true
              return
          }
      },

      addPieceToColumn(e, column){
          if (this.playerTurn !== 1) {
              return;
          }
        
          if (this.winner == true) {
              return;
          }
          var spot = this.getOpenSpotInColumn(column);
          
          if(spot===null){
              //unable to add piece to full column
              return;
          }
          
          
          //TODO: see if going between board and DOM can be simplified/unified
          
          this.board[spot.column][spot.row] = this.playerTurn;
          e.currentTarget.children[spot.row].children[0].classList.add(this.playerTurn===1 ? "red" : "blue");

          this.checkWinner(spot.row, spot.column);

          if (this.winner === false) {
              this.playerTurn = 2;
              setTimeout(this.addComputerPiece.bind(this), 1000);
          }
  
      },
      getOpenSpotInColumn(column){
          for(var row = this.rowCount-1; row >=0; row--) {
              
              if(this.board[column][row]===0){//found an open spot
                  return {
                      "column": column,
                      "row": row
                  };
              }
          }
          
          //column is full
          return null;
      },
      checkHorizontal(row) {
          const board = this.board;
          
          let count = 0;

          for (let i = 0; i < this.columnCount; i++) {
              if (board[i][row] === this.playerTurn) {
                  count++;
              } else {
                  count = 0;
              }
              if (count === 4) {
                  return true;
              }
          }

        return false;
        
    },
    checkVertical(col) {
        const board = this.board;

        let count = 0;

        for (let i = 0; i < this.rowCount; i++) {
            if (board[col][i] === this.playerTurn) {
                count++;
            } else {
                count = 0;
            }
            if (count === 4) {
                return true;
            }
        }
        return false;
    },

    checkMajor(row, col) {

        const board = this.board;

        while (col > 0 && row > 0) {
            col--;
            row--;
        }

        let count = 0;

        while (col < this.columnCount && row < this.rowCount) {
            if (board[col][row] === this.playerTurn) {
                count++;
            } else {
                count = 0;
            }
            if (count === 4) {
                return true;
            }
            row++;
            col++;
        }

        return false;
    },

    checkMinor(row, col) {

        const board = this.board;
        while (col < this.columnCount - 1 && row > 0) {
            col++;
            row--;
        }
        let count = 0;
        while (col >= 0 && row < this.rowCount) {
            if (board[col][row] === this.playerTurn) {
                count++;
            } else {
                count = 0;
            }
            if (count === 4) {
                return true;
            }
            col--;
            row++;
        }

        return false;
    }

   }
});
