/*eslint-env browser */
/*globals $ */

var hasPiece = function (tile) {
  return tile.hasClass('black') || tile.hasClass('white');
}

var Piece = function Piece (x, y, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  
  var tile = $('.tile[col=' + x + '][row=' + y + ']');
  tile.addClass(color);
  tile.addClass(this.type);
};

var move = function (piece, row, col) {
  var tile = $('.tile[col=' + piece.x + '][row=' + piece.y + ']');
  tile.removeClass(piece.type);
  tile.removeClass(piece.color);
  var newTile = $('.tile[col=' + col + '][row=' + row + ']');
  var classes = $(newTile).attr('class').split(' ');
  newTile.removeClass(classes[2] + ' ' + classes[3]);
  newTile.addClass(piece.type);
  newTile.addClass(piece.color);
  piece.x = col;
  piece.y = row;
  if (piece.type === 'pawn') {
    piece.moved = true;
  }
};

Piece.prototype.move = function (row, col) {
  move(this, row, col);
};

var Pawn = function Pawn (x, y, color) {
  this.moved = false;
  this.type = 'pawn';
  Piece.call(this, x, y, color);
};

Pawn.prototype = Object.create(Piece.prototype);

Pawn.prototype.canMove = function (row, col) {
  var tile = $('.tile[col=' + col + '][row=' + row + ']');
  if (this.color === 'white') {
    if (row == parseInt(this.y) + parseInt(1)) {
      if (col == parseInt(this.x) + parseInt(1) || col == parseInt(this.x) - parseInt(1)) {
        return tile.hasClass('black');
      } else if (col == this.x) {
        return !hasPiece(tile);
      }
    } else if (row == this.y + 2 && col == this.x) {
      if (!this.moved) {
        var tileInFront = $('.tile[col=' + col + '][row=' + (parseInt(row) - parseInt(1)) + ']');
        return !hasPiece(tile) && !hasPiece(tileInFront);
      }
    }
    return false;
  } else {
    if (row == parseInt(this.y) - parseInt(1)) {
      if (col == parseInt(this.x) + parseInt(1) || col == parseInt(this.x) - parseInt(1)) {
        return tile.hasClass('white');
      } else if (col == this.x) {
        return !hasPiece(tile);
      }
    } else if (row == this.y - 2 && col == this.x) {
      if (!this.moved) {
        tileInFront = $('.tile[col=' + col + '][row=' + (parseInt(row) + parseInt(1)) + ']');
        return !hasPiece(tile) && !hasPiece(tileInFront);
      }
    }
    return false;
  }
};

var Rook = function Rook (x, y, color) {
  this.type = 'rook';
  Piece.call(this, x, y, color);
};

Rook.prototype = Object.create(Piece.prototype);

Rook.prototype.canMove = function (row, col) {
  if (row == this.y && col == this.x) {
    return false;
  }
  var target = $('.tile[col=' + col + '][row=' + row + ']');
  if (row == this.y) {
    if (col > this.x) {
      while (col > this.x) {
        var tile = $('.tile[col=' + col + '][row=' + row + ']');
        if (col != $(target).attr('col')) {
          if (hasPiece(tile)) {
            return false;
          }
        }
        col--;
      }
    } else if (col < this.x) {
      while (col < this.x) {
        tile = $('.tile[col=' + col + '][row=' + row + ']');
        if (col != $(target).attr('col')) {
          if (hasPiece(tile)) {
            return false;
          }
        }
        col++;
      }
    }
    return !$(target).hasClass(this.color);
  } else if (col == this.x) {
    if (row > this.y) {
      while (row > this.y) {
        tile = $('.tile[col=' + col + '][row=' + row + ']');
        if (row != $(target).attr('row')) {
          if (hasPiece(tile)) {
            return false;
          }
        }
        row--;
      }
    } else if (row < this.y) {
      while (row < this.y) {
        tile = $('.tile[col=' + col + '][row=' + row + ']');
        if (row != $(target).attr('row')) {
          if (hasPiece(tile)) {
            return false;
          }
        }
        row++;
      }
    }
    return !$(target).hasClass(this.color);
  }
  return false;
};

var Knight = function Knight (x, y, color) {
  this.type = 'knight';
  Piece.call(this, x, y, color);
};

Knight.prototype = Object.create(Piece.prototype);

Knight.prototype.canMove = function (row, col) {
  var target = $('.tile[col=' + col + '][row=' + row + ']');
  if (target.hasClass(this.color)) {
    return false;
  }
  var x = this.x;
  var y = this.y;
  return (row == parseInt(y) + parseInt(1) && col == parseInt(x) + parseInt(2)) || (row == parseInt(y) + parseInt(1) && col == x - 2) || (row == y - 1 && col == parseInt(x) + parseInt(2)) || (row == y - 1 && col == x - 2) ||
  (row == parseInt(y) + parseInt(2) && col == parseInt(x) + parseInt(1)) || (row == parseInt(y) + parseInt(2) && col == x - 1) ||
  (row == y - 2 && col == parseInt(x) + parseInt(1)) || (row == y - 2 && col == x - 1);
};

var Bishop = function Bishop (x, y, color) {
  this.type = 'bishop';
  Piece.call(this, x, y, color);
};

Bishop.prototype = Object.create(Piece.prototype);

Bishop.prototype.canMove = function (row, col) {
  if (row == this.y && col == this.x) {
    return false;
  }
  var target = $('.tile[col=' + col + '][row=' + row + ']');
  if (Math.abs(row - this.y) === Math.abs(col - this.x)) {
    while (col != this.x) {
      var tile = $('.tile[col=' + col + '][row=' + row + ']');
      if (col != $(target).attr('col')) {
        if (hasPiece(tile)) {
          return false;
        }
      }
      if (col > this.x) {
        col--;
        if (row > this.y) {
          row--;
        } else {
          row++;
        }
      } else {
        col++;
        if (row > this.y) {
          row--;
        } else {
          row++;
        }
      }
    }
    return !$(target).hasClass(this.color);
  }
  return false;
};

var Queen = function Queen (x, y, color) {
  this.type = 'queen';
  Piece.call(this, x, y, color);
};

Queen.prototype = Object.create(Piece.prototype);

Queen.prototype.canMove = function (row, col) {
  if (row == this.y && col == this.x) {
    return false;
  }
  var target = $('.tile[col=' + col + '][row=' + row + ']');
  if (row == this.y) {
    if (col > this.x) {
      while (col > this.x) {
        var tile = $('.tile[col=' + col + '][row=' + row + ']');
        if (col != $(target).attr('col')) {
          if (hasPiece(tile)) {
            return false;
          }
        }
        col--;
      }
    } else if (col < this.x) {
      while (col < this.x) {
        tile = $('.tile[col=' + col + '][row=' + row + ']');
        if (col != $(target).attr('col')) {
          if (hasPiece(tile)) {
            return false;
          }
        }
        col++;
      }
    }
    return !$(target).hasClass(this.color);
  } else if (col == this.x) {
    if (row > this.y) {
      while (row > this.y) {
        tile = $('.tile[col=' + col + '][row=' + row + ']');
        if (row != $(target).attr('row')) {
          if (hasPiece(tile)) {
            return false;
          }
        }
        row--;
      }
    } else if (row < this.y) {
      while (row < this.y) {
        tile = $('.tile[col=' + col + '][row=' + row + ']');
        if (row != $(target).attr('row')) {
          if (hasPiece(tile)) {
            return false;
          }
        }
        row++;
      }
    }
    return !$(target).hasClass(this.color);
  }
  if (Math.abs(row - this.y) === Math.abs(col - this.x)) {
    while (col != this.x) {
      tile = $('.tile[col=' + col + '][row=' + row + ']');
      if (col != $(target).attr('col')) {
        if (hasPiece(tile)) {
          return false;
        }
      }
      if (col > this.x) {
        col--;
        if (row > this.y) {
          row--;
        } else {
          row++;
        }
      } else {
        col++;
        if (row > this.y) {
          row--;
        } else {
          row++;
        }
      }
    }
    return !$(target).hasClass(this.color);
  }
  return false;
};

var King = function King (x, y, color) {
  this.type = 'king';
  Piece.call(this, x, y, color);
};

King.prototype = Object.create(Piece.prototype);

King.prototype.canMove = function (row, col) {
  if (row == this.y && col == this.x) {
    return false;
  }
  var target = $('.tile[col=' + col + '][row=' + row + ']');
  if (Math.abs(col - this.x) <= 1 && Math.abs(row - this.y) <= 1) {
    return !$(target).hasClass(this.color);
  }
  return false;
};