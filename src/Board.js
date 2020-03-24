import React, {Component} from "react";
import Cell from "./Cell";
import './Board.css';

/* ========== Game Board ========== */ 

class Board extends Component {
  static defaultProps = {
    // nrows: number of rows of board
    // ncols: number of cols of board
    // chanceLightStartsOn: chance any cell is lit at start of game
    nrows: 5, 
    ncols: 5,
    chanceLightStartsOn: 0.25
  };

  constructor(props) {
    super(props);
    this.state = {
      // hasWon: boolean, true when board is all off
      // board: array-of-arrays of true/false
      hasWon: false,
      board: this.createBoard()
    }
  }

  // create a board nrows high/ncols wide, each cell randomly lit or unlit
  createBoard() {
    let board = [];
    // array-of-arrays of true/false values
    for(let y=0; y < this.props.nrows; y++) {
      let row=[];
      for(let x=0; x < this.props.ncols; x++) {
        row.push(Math.random() < this.props.chanceLightStartsOn)
      }
      board.push(row);
    }
    return board
  }

  // handle changing a cell: update board & determine if winner

  flipCellsAround(coord) {
    let {ncols, nrows} = this.props;
    let board = this.state.board;
    let [y, x] = coord.split("-").map(Number);


    function flipCell(y, x) {
      // if this coord is actually on board, flip it
      if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
        board[y][x] = !board[y][x];
      }
    }

    // flip this cell and the cells around it
    flipCell(y, x);      // Flip initial cell
    flipCell(y, x - 1);  // Flip left cell
    flipCell(y, x + 1);  // Flip right cell
    flipCell(y - 1, x);  // Flip lower cell
    flipCell(y + 1, x);  // Flip upper cell    

    // win when every cell is turned off
    let hasWon = board.every(row => row.every(cell => !cell));

    this.setState({board: board, hasWon: hasWon});
  }

  /* ========== Render game board OR winning message ========== */

    render() {
      if(this.state.hasWon) {
        return (
          <div className="Board-title">
            <div class="winner">
              <span className="neon-orange">YOU</span>
              <span className="neon-blue">WIN!</span>
            </div>
          </div>
        );
      }

    // make table board
    let tblBoard = [];
    for(let y=0; y < this.props.nrows; y++) {
      let row = [];
      for(let x=0; x < this.props.ncols; x++) {
        let coord=`${y}-${x}`;
        row.push(
          <Cell 
            key={coord} 
            isLit={this.state.board[y][x]} 
            flipCellsAroundMe = {() => this.flipCellsAround(coord)}
          />)
        }
      tblBoard.push(<tr key={y}>{row}</tr>);
    }
    return (
      <div>
        <div className="Board-title">
          <div className="neon-orange">Lights</div>
          <div className="neon-blue">Out</div>
        </div>
        <table className="Board">
          <tbody>{ tblBoard }</tbody>
        </table>
      </div>
    );
  }
}

export default Board;
