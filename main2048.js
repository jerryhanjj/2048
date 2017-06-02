/**
 * Created by Jerry on 2016/10/28 0028.
 */
var board = new Array();
var score = 0;
var hasConflicted = new Array();

$(document).ready(function () {
    /*prepareForMobile();*/
    newgame();
});

function prepareForMobile() {

    $('#grid_container').css('width',gridContainerWidth-2*cellSpace);
    $('#grid_container').css('height',gridContainerWidth-2*cellSpace);
    $('#grid_container').css('padding',cellSpace);

}


function newgame() {
    // 初始化棋盘函数
    init();
    //随机两个格子生成数字
    generateOneNumber();
    generateOneNumber();
}

function init() {
    for (var i = 0; i < 4; i++){
        for ( var j = 0; j < 4; j++){
            var gridCell = $('#grid_cell_'+i+'_'+j);
            gridCell.css('top', getPosTop(i, j) );
            gridCell.css('left', getPosLeft(i, j) );
        }
    }
    for(var i = 0; i < 4; i++){
        board[i] = new Array();
        hasConflicted[i] = new Array();
        for(var j = 0; j < 4; j++){
            board[i][j] = 0;
            hasConflicted[i][j] = false;
        }
    }
    score = 0;
    updateScore(score);
    updateBoardView();      // 更新格子信息
}

function updateBoardView() {
    $('.number_cell').remove();
    for (var i=0;i<4;i++){
        for (var j=0;j<4;j++){
            $('#grid_container').append('<div class = "number_cell" id = "number_cell_'+i+'_'+j+'"></div>');
            var theNumberCell = $('#number_cell_'+i+'_'+j);
            if (board[i][j] == 0)
            {
                theNumberCell.css('width','0px');
                theNumberCell.css('height','0px');
                theNumberCell.css('top', getPosTop(i,j)+50);
                theNumberCell.css('left', getPosLeft(i,j)+50);
            }else {
                theNumberCell.css('width','100px');
                theNumberCell.css('height','100px');
                theNumberCell.css('top',getPosTop(i,j));
                theNumberCell.css('left',getPosLeft(i,j));
                theNumberCell.css('background-color', getNumberBackgroundColor(board[i][j]));
                theNumberCell.css('color', getNumberColor(board[i][j]));
                theNumberCell.text(board[i][j]);
            }
            hasConflicted[i][j] = false;
        }
    }
}

function generateOneNumber() {
    if (nospace(board))
        return false;
    // 随机一个位置
    var randx = parseInt(Math.floor(Math.random()*4));
    var randy = parseInt(Math.floor(Math.random()*4));

    var times = 0;
    while (times<50)
    {
        if (board[randx][randy] == 0)
            break;
        randx = parseInt(Math.floor(Math.random()*4));
        randy = parseInt(Math.floor(Math.random()*4));

        times++;
    }
    if (times == 50){
        for (var i=0;i<4;i++){
            for (var j=0;j<4;j++){
                if (board[i][j] == 0){
                    randx = i;
                    randy = j;
                }
            }
        }
    }

    // 随机一个数字

    var randNumber = Math.random()<0.5?2:4;

    // 显示随机数字
    board[randx][randy] = randNumber;

    showNumberAnimation(randx,randy,randNumber);

    return true;
}

// 键盘响应
$(document).keydown(function (event) {
    switch (event.keyCode){
        case 37:    // left
            if (moveLeft()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 38:    // up
            if (moveUp()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 39:    // right
            if (moveRight()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        case 40:    // dowm
            if (moveDown()) {
                setTimeout("generateOneNumber()",210);
                setTimeout("isgameover()",300);
            }
            break;
        default:    // default
            break;
    }
});

function gameover(){
    alert('gameover!');
}

function isgameover(){
    if( nospace( board ) && nomove( board ) ){
        gameover();
    }
}

// 左移

function moveLeft() {
    if (!canMoveLeft(board))
    {
        return false;
    }
    for (var i=0;i<4;i++){
        for (var j=1;j<4;j++){      // 最左的列不用考虑 j 从 1 开始
            if (board[i][j] != 0){
                for (var k=0;k<j;k++){
                    if (board[i][k] == 0 && noBlockHoriztal(i,k,j,board)){
                        // 动画
                        showMoveAnimation(i,j,i,k);
                        // move
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][j] == board[i][k] && noBlockHoriztal(i,k,j,board) && !hasConflicted[i][k] ) {
                        // move
                        showMoveAnimation(i,j,i,k);
                        // add
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
// 上移
function moveUp() {
    if (!canMoveUp(board)){
        return false;
    }
    for (var i=1;i<4;i++){
        for (var j=0;j<4;j++){
            if (board[i][j] != 0){
                for (var k=0;k<i;k++){
                    if (board[k][j] == 0 && noBlockHoriztal(j,k,i,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[k][j] == board[i][j] && noBlockHoriztal(j,k,i,board) && !hasConflicted[k][i]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[i][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

// 右移
function moveRight() {
    if (!canMoveRight(board)){
        return false;
    }
    for (var i=0;i<4;i++){
        for (var j=2;j>=0;j--){
            if (board[i][j] != 0){
                for (var k=3;k>j;k--){
                    if (board[i][k] == 0 && noBlockHoriztal(i,j,k,board)){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][j] == board[i][k] && noBlockHoriztal(i,k,j,board) && !hasConflicted[i][k]){
                        showMoveAnimation(i,j,i,k);
                        board[i][k] += board[i][j];
                        board[i][j] = 0;
                        score += board[i][k];
                        updateScore(score);
                        hasConflicted[i][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}

// 下移
function moveDown() {
    if (!canMoveDown(board)){
        return false;
    }
    for (var i=2;i>=0;i--){
        for (var j=0;j<4;j++){
            if (board[i][j] != 0){
                for (var k=3;k>i;k--){
                    if (board[k][j] == 0 && noBlockHoriztal(j,i,k,board)){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] = board[i][j];
                        board[i][j] = 0;
                        continue;
                    }
                    else if (board[i][j] == board[k][j] && noBlockHoriztal(j,i,k,board) && !hasConflicted[k][j]){
                        showMoveAnimation(i,j,k,j);
                        board[k][j] += board[i][j];
                        board[i][j] = 0;
                        score += board[k][j];
                        updateScore(score);
                        hasConflicted[i][j] = true;
                        continue;
                    }
                }
            }
        }
    }
    setTimeout("updateBoardView()",200);
    return true;
}
