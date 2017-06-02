/**
 * Created by Administrator on 2016/11/7 0007.
 */
function showNumberAnimation(x,y,randnumber) {

    var numberCell = $('#number_cell_'+x+'_'+y);

    numberCell.css('background-color',getNumberBackgroundColor(randnumber));
    numberCell.css('color', getNumberColor(randnumber));
    numberCell.text(randnumber);

    numberCell.animate({
        width:"100px",
        height:"100px",
        top: getPosTop(x,y),
        left: getPosLeft(x,y)
    },100);
}

function showMoveAnimation(formx,formy,tox,toy) {
    var numberCell = $('#number_cell_'+formx+'_'+formy);
    numberCell.animate({
        top:getPosTop(tox,toy),
        left:getPosLeft(tox,toy)
    },200);
}

function updateScore(score) {
    $("#score").text(score);
}