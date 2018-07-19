/* main render file for teh game */
// let cannon_attrs = ['direction'];
// let tank_attrs = ['id', 'position', 'team'];

let me =  {
        "id": 0,
        "position": {
            "x": 200,
            "y": 200
        },
        "team": 0,
        "hp": 40,
        "cannons": {"direction": 0, "power": 1}

    };
let tanksData = [
    {
        "id": 1,
        "position": {
            "x": 250,
            "y": 200
        },
        "team": 0,
        "hp": 50,
        "cannons": {"direction": 10, "power": 1}
    },
    {
        "id": 2,
        "position": {
            "x": 150,
            "y": 200
        },
        "team": 1,
        "hp": 10,
        "cannons": {"direction": 180, "power": 1}
    },
];
let bulletData = [
    {
        "team": 0,
        "position": {
            "x" : 150,
            "y": 220
        }
    },
    {
        "team": 1,
        "position": {
            "x" : 250,
            "y": 270
        }
    }
];

let render = function () {

    let renderTank = function (g) {
        g.each(function (d, i) {
            let container = d3.select(this)
                .append("g")
                .attr("id", function (d) {
                    return "tank-" + d.id;
                });

            let posX = d.position.x - me.position.x + mePosX;
            let posY = d.position.y - me.position.y + mePosY;

            container.append("circle")
                .attr("r", tank_size)
                .attr("cx", posX)
                .attr("cy", posY)
                // .attr("opacity", 0.5)
                .attr("fill", function(d) { return d.team == 0? team_color_0 : team_color_1 });

            container.append("g")
                .attr("transform", "rotate("+ (d.cannons.direction) + " " + posX + " " + posY +")" + "translate(-"+ tank_size / 2 + "," + 0 + ")"+"")
                .append("rect")
                .attr("width", tank_size)
                .attr("height", tank_size * 2)
                .attr("x", posX)
                .attr("y", posY)
                .attr("fill", function(d) { return d.team == 0? team_color_0 : team_color_1 });

            container.append("rect")
                .attr("width", hpbarWidth)
                .attr("height", hpbarHeight)
                .attr("x", posX - hpbarWidth / 2)
                .attr("y", posY - hpbarHeight * 6.5)
                .attr("fill", "none")
                .attr("stroke", "green")
                .attr("stroke-width", "0.2px");

            container.append("rect")
                .attr("width", function () {
                    return d.hp > maxHp? hpbarWidth : d.hp < 0? 0 : hpbarWidth * (d.hp / maxHp);
                })
                .attr("height", hpbarHeight)
                .attr("x", posX - hpbarWidth / 2)
                .attr("y", posY - hpbarHeight * 6.5)
                .attr("fill", "red")
                .attr("stroke", "none")
                .attr("stroke-width", "0");
        })
    };

    let renderBullet = function (g) {
        g.each(function (d, i) {
            let container = d3.select(this)
                .append("g");

            let posX = d.position.x - me.position.x + mePosX;
            let posY = d.position.y - me.position.y + mePosY;

            container.append("circle")
                .attr("r", bullet_size)
                .attr("cx", posX)
                .attr("cy", posY)
                .attr("opacity", 0.8)
                .attr("fill", function(d) { return d.team == 0? team_color_0 : team_color_1 });
        })
    };

    d3.select("#gamne-svg").remove();

    let svg = d3.select("#svg-container")
        .append("svg")
        .attr("width", svg_width)
        .attr("height", svg_height)
        .attr("id", "game-svg")
        .append("g")
        .attr("id", "svg-group")
        .attr("transform", function () {
            let transX = (1 - scaleFactor) * mePosX;
            let transY = (1 - scaleFactor) * mePosY;
            return "translate(" + transX + " " + transY + ")" +" scale("+ scaleFactor +")";
        });

    let tankGroup = svg.append("g")
        .attr("id", "tanks");
    // .attr("transform", "translate("+ 100 + "," + 0 + ")");
    let bulletGroup = svg.append("g")
        .attr("id", "bullets");
// (1 - scale) * currentPosition
// ****** draw myself **************
    let meTank = tankGroup.append("g")
        .attr("id", "tank-me");
    meTank.append("circle")
        .attr("r", tank_size)
        .attr("cx", function (d) {
            return mePosX;
        })
        .attr("cy", function (d) {
            return mePosY;
        })
        // .attr("opacity", 0.5)
        .attr("fill", me.team == 0? team_color_0 : team_color_1);
    meTank.append("g")
        .attr("transform", "rotate("+ (me.cannons.direction) + " " + mePosX + " " + mePosY +")" + "translate(-"+ tank_size / 2 + "," + 0 + ")"+"")
        .append("rect")
        .attr("width", tank_size)
        .attr("height", tank_size * 2)
        .attr("x", mePosX)
        .attr("y", mePosY)
        .attr("fill", me.team == 0? team_color_0 : team_color_1);
    meTank.append("rect")
        .attr("width", hpbarWidth)
        .attr("height", hpbarHeight)
        .attr("x", mePosX - hpbarWidth / 2)
        .attr("y", mePosY - hpbarHeight * 6.5)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", "0.2px");
    meTank.append("rect")
        .attr("width", function () {
            return me.hp > maxHp? hpbarWidth : me.hp < 0? 0 : hpbarWidth * (me.hp / maxHp);
        })
        .attr("height", hpbarHeight)
        .attr("x", mePosX - hpbarWidth / 2)
        .attr("y", mePosY - hpbarHeight * 6.5)
        .attr("fill", "red")
        .attr("stroke", "none")
        .attr("stroke-width", "0");
// ******** draw myself end **************


    let tanks = tankGroup.selectAll(".tank")
        .data(tanksData)
        .enter()
        .call(renderTank);

    let bullets = bulletGroup.selectAll(".bullet")
        .data(bulletData)
        .enter()
        .call(renderBullet);

};

render();

var socket = io('http://localhost');
socket.on('push', function (data) {
    console.log(data);
    tanksData = data.tank_dict;
    data.bullet_list_team1.forEach(function (d) {
        bulletData.push({
            "team": 0,
            "position": {
                "x" : d.x,
                "y": d.y
            }
        });
    });
    data.bullet_list_team2.forEach(function (d) {
        bulletData.push({
            "team": 1,
            "position": {
                "x" : d.x,
                "y": d.y
            }
        });
    });
    render();
});

document.addEventListener('keypress', (event) => {
    const keyName = event.key;
    // a d w s left right
    let a = keyName === 'a';
    let d = keyName === 'd';
    let w = keyName === 'w';
    let s = keyName === 's';
    let left = keyName === 'j';
    let right = keyName === 'k';
    socket.emit('update', { tank_data: {
            id: me.id,
            direction_key_press: [a, d, w, s, left, right],
            team: me.team
        } });
});



