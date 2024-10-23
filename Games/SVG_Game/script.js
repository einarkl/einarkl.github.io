window.location = "https://einarkl.no" + location.pathname;
let player;
let position = {
    x: 0,
    y: 0
};
let cx, cy;
let rotation = 0;
let speed = 5;

$(() => {
    initPlayer();

    $(window).on("keydown", e => {
        // UP: 38
        // LEFT: 37
        // RIGHT: 39
        // DOWN: 40
        if (e.which === 37 || e.which === 38 || e.which === 39 || e.which === 40) {
            let top = $(player).position().top;
            let left = $(player).position().left;
            if (e.which === 38) {
                console.log("ARROW_UP");
                position.y -= speed;
            }
            if (e.which === 37) {
                console.log("ARROW_LEFT");
                // position.x -= speed;
                rotation -= speed;
            }
            if (e.which === 39) {
                console.log("ARROW_RIGHT");
                // position.x += speed;
                rotation += speed;
            }
            
            $(player).attr("transform", "rotate(" + rotation + "," + cx + "," + cy + ") translate(" + position.x + "," + position.y + ")");
            cx += $(player).position().left - left;
            cy += $(player).position().top - top;
        }
    });
});

function initPlayer() {
    player = document.createElementNS('http://www.w3.org/2000/svg', "polygon");
    let width = $("body").width();
    let height = $("body").height();
    cx = width / 2;
    cy = height / 2;
    let points = [cx + "," + (cy - 25), (cx + 15) + "," + (cy + 25), cx + "," + (cy + 15), (cx - 15) + "," + (cy + 25), cx + "," + (cy - 25)].join(" ");
    let fill = "blue";
    let stroke = "black";
    let strokeWidth = "1";
    $(player).attr("id", "player");
    $(player).attr("points", points);
    $(player).attr("transform", "translate(0, 0) rotate(0)");
    $(player).attr("style", "fill:"+fill+";stroke:"+stroke+";stroke-width:"+strokeWidth);

    $("#svg").append(player);
}