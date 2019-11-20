const LEFT, RIGHT, BOT, TOP;
    LEFT = 8;
    RIGHT = 4;
    BOT = 2;
    TOP  = 1;


function GetOutCode(pt, view) {
    let outcode = 0;
    if(pt.x < view.x_min) {
        outcode += LEFT;
    } else if(pt.x > view.x_max) {
        outcode += RIGHT;
    }
    if(pt.y < view.y_min) {
        outcode += BOT;
    } else if(pt.y > view.y_max){
        outcode += TOP;
    }
    return outcode;
}

function ClipLine(pt0, pt1, view) {
    let result = {
        pt0: {},
        pt1: {}
    };
    let outcode0 = GetOutCode(pt0);
    let outcode1 = GetOutCode(pt1);
    let delta_x = pt1.x - pt0.x;
    let delta_y = pt1.y - pt0.y;
    let b = pt0.y - ((delta_y / delta_x) * pt0.x);

    let done = false;
    while(!done) {
        if((outcode0 | outcode1) === 0) { // Trivial accept
            done = true;
            result.pt0.x = pt0.x;
            result.pt0.y = pt0.y;
            result.pt1.x = pt1.x;
            result.pt1.y = pt1.y;
        } else if ((outcode0 & outcode1) !== 0) { //Trivial reject 
            done = true;
            result = null;
        } else {
            let selected_pt; // we pick a point that is outside the view
            let selected_outcode;
            if(outcode0 > 0) {
                select_pt = pt0;
                selected_outcode = outcode0;
            } else {
                select_pt = pt1;
                selected_outcode = outcode1;
            }
            if((selected_outcode & LEFT) === LEFT) {
                selected_pt.x = view.x_min;
                selected_pt.y = (delta_y / delta_x) * selected_outcode.x + b;
            } else if((selected_outcode & RIGHT) === RIGHT) {
                selected_pt.x = view.x_max;
                selected_pt.y = (delta_y / delta_x) * selected_outcode.x + b;
            } else if((selected_outcode & BOT) === BOT) {
                selected_pt.y = view.y_min;
                selected_pt.x = (selected_pt.y -b) * (delta_x / delta_y);
            } else { // we know it's the top
            selected_pt.y = view.y_max;
            selected_pt.x = (selected_pt.y -b) * (delta_x / delta_y);
            }
            if(outcode0 > 0) {
                outcode0 = selected_outcode;
            } else {
                outcode1 = selected_outcode;
            }
        }
    }
    return result;
}
function Init() {

    console.log('init');

    

    let w = 600;
    let h = 600;

    let mycanvas = document.getElementById('mycanvas');

    mycanvas.width = w;
    mycanvas.hieght = h;


    let ctx = mycanvas.getContext("2d");
    
    // Get copy of the framebuffer
    let framebuffer = ctx.getImageData(0, 0, w, h);



}

function Draw_Line(x1, y1, x2, y2) {

    // Logical comparison before bitwise comparison

    // check which point is outside the canvas
    let outside_point;
    if(x1 < mycanvas.width || x1 > mycanvas.width) {

    } else if (y1 < mycanvas.hieght || y1 > mycanvas.hieght) {

    }

    if(x2 > mycanvas.width || x2 < mycanvas.width) {

    }else if(y2 < mycanvas.hieght || y2 > mycanvas.hieght) {

    } 
}