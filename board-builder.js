/*eslint-env browser */
/*globals $, Pawn, Rook, Knight, Bishop, Queen, King */

var selected;
var whiteTurn;
var clicked;
var whitePos;
var blackPos;

var BoardBuilder = function () {};

BoardBuilder.prototype.setupBoard = function () {
  whiteTurn = true;
  whitePos = {x: 5, y: 1};
  blackPos = {x: 5, y: 8};
  
  var getPiece = function (row, col) {
    var clicked = whitePieces.filter(function (piece) {
      if (piece.x == col && piece.y == row) {
        return piece;
      }
    });
    if (clicked.length === 0) {
      clicked = blackPieces.filter(function (piece) {
        if (piece.x == col && piece.y == row) {
          return piece;
        }
      });
    }
    return clicked[0];
  }
  
  var inCheck = function (color) {
    var check = false;
    if (color === 'white') {
      blackPieces.forEach( function (piece) {
        if (piece.canMove(whitePos.y, whitePos.x)) {
          check = true;
        }
      });
      return check;
    } else {
      whitePieces.forEach( function (piece) {
        if (piece.canMove(blackPos.y, blackPos.x)) {
          check = true;
        }
      });
      return check;
    }
  }
  
  function onMouseDown () {
    var tile = $(this).get(0);
    var row = $(tile).attr('row');
    var col = $(tile).attr('col');
    
    if (clicked) {
      clicked.removeClass('clicked');
    }
    clicked = $('.tile[col=' + col + '][row=' + row + ']');
    clicked.addClass('clicked');
    
    if (!selected) {
      selected = getPiece(row, col);
    } else {
      if (selected.canMove(row, col)) {
        if (whiteTurn && selected.color === 'white' || !whiteTurn && selected.color === 'black') {
          selected.move(row, col);
          if (selected.type === 'king') {
            if (whiteTurn) {
              whitePos = {x: col, y: row};
            } else {
              blackPos = {x: col, y: row};
            }
          }
          var piece = getPiece(row, col);
          if (whiteTurn) {
            blackPieces = blackPieces.filter(function (blackPiece) {
              return blackPiece !== piece;
            });
          } else {
            whitePieces = whitePieces.filter(function (whitePiece) {
              return whitePiece !== piece;
            });
          }
          whiteTurn = !whiteTurn;
          if (whiteTurn) {
            $('.status').html('WHITE to move');
            if (inCheck('white')) {
              $('.status').html('WHITE in check');
            }
          } else {
            $('.status').html('BLACK to move');
            if (inCheck('black')) {
              $('.status').html('BLACK in check');
            }
          }
        }
      }
      selected = undefined;
      clicked.removeClass('clicked');
    }
  }
  
  for (var i = 0; i < 4; i++) {
    var $newRow = $('<div>');
    $newRow.addClass('row');
    $('.board').append($newRow);
    for (var j = 0; j < 4; j++) {
      var $lightSquare = $('<div>');
      $lightSquare.addClass('tile light');
      $lightSquare.attr('row', 8 - 2 * i);
      $lightSquare.attr('col', 2 * j + 1);
      $lightSquare.on('mousedown', onMouseDown);
      $($newRow).append($lightSquare);
      var $darkSquare = $('<div>');
      $darkSquare.addClass('tile dark');
      $darkSquare.attr('row', 8 - 2 * i);
      $darkSquare.attr('col', 2 * j + 2);
      $darkSquare.on('mousedown', onMouseDown);
      $($newRow).append($darkSquare);
    }
    var $newRow2 = $('<div>');
    $newRow2.addClass('row');
    $('.board').append($newRow2);
    for (j = 0; j < 4; j++) {
      $darkSquare = $('<div>');
      $darkSquare.addClass('tile dark');
      $darkSquare.attr('row', 7 - 2 * i);
      $darkSquare.attr('col', 2 * j + 1);
      $darkSquare.on('mousedown', onMouseDown);
      $($newRow2).append($darkSquare);
      $lightSquare = $('<div>');
      $lightSquare.addClass('tile light');
      $lightSquare.attr('row', 7 - 2 * i);
      $lightSquare.attr('col', 2 * j + 2);
      $lightSquare.on('mousedown', onMouseDown);
      $($newRow2).append($lightSquare);
    }
  }
  
  var whitePieces = [
    new Pawn(1, 2, 'white'),
    new Pawn(2, 2, 'white'),
    new Pawn(3, 2, 'white'),
    new Pawn(4, 2, 'white'),
    new Pawn(5, 2, 'white'),
    new Pawn(6, 2, 'white'),
    new Pawn(7, 2, 'white'),
    new Pawn(8, 2, 'white'),
    new Rook(1, 1, 'white'),
    new Rook(8, 1, 'white'),
    new Knight(2, 1, 'white'),
    new Knight(7, 1, 'white'),
    new Bishop(3, 1, 'white'),
    new Bishop(6, 1, 'white'),
    new Queen(4, 1, 'white'),
    new King(5, 1, 'white')
  ];
  
  var blackPieces = [
    new Pawn(1, 7, 'black'),
    new Pawn(2, 7, 'black'),
    new Pawn(3, 7, 'black'),
    new Pawn(4, 7, 'black'),
    new Pawn(5, 7, 'black'),
    new Pawn(6, 7, 'black'),
    new Pawn(7, 7, 'black'),
    new Pawn(8, 7, 'black'),
    new Rook(1, 8, 'black'),
    new Rook(8, 8, 'black'),
    new Knight(2, 8, 'black'),
    new Knight(7, 8, 'black'),
    new Bishop(3, 8, 'black'),
    new Bishop(6, 8, 'black'),
    new Queen(4, 8, 'black'),
    new King(5, 8, 'black')
  ];
};