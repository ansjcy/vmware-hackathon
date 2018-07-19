

var tank_list = {} //id, tank.size, tank.position, tank.velocity, tank.team, tank.angle, tank.hp, tank.nextBullet
var bullet_array = [] //bullet: size, position, velocity, lastTime, team



var map_width = 800
var map_height = 800
var m = 20
var n = 20
var accV = 0.1
var accA = 2.0
var bulletInterval = 30
var blue_team = 0
var red_team = 1

var VELLIMIT       = 10
var HP             = 50
var QUANTUM        = 0.01
var BULLET_VEL         = 10

var s_param = 0.02

tank_list = {
		"aaa" : {id: "aaa", size: 5, position:{x:230, y:230}, velocity:{x:5, y:5}, team:blue_team, hp:50, angle:30},
		"bbb" : {id: "bbb", size: 5, position:{x:230, y:235}, velocity:{x:5, y:5}, team:red_team, hp:50, angle:30}
		// "ccc" : {id: "ccc", size: 5, position:{x:240, y:240}, velocity:{x:5, y:5}, team:1, hp:50},
		// "ddd" : {id: "ddd", size: 5, position:{x:220, y:280}, velocity:{x:5, y:5}, team:2, hp:50},
		// "eee" : {id: "eee", size: 5, position:{x:235, y:235}, velocity:{x:5, y:5}, team:1, hp:50},
		// "fff" : {id: "fff", size: 5, position:{x:232, y:232}, velocity:{x:5, y:5}, team:2, hp:50},
		// "ggg" : {id: "ggg", size: 5, position:{x:230, y:230}, velocity:{x:5, y:5}, team:1, hp:50},
		// "hhh" : {id: "hhh", size: 5, position:{x:530, y:530}, velocity:{x:5, y:5}, team:2, hp:50},
		// "iii" : {id: "iii", size: 5, position:{x:530, y:535}, velocity:{x:5, y:5}, team:1, hp:50},
		// "jjj" : {id: "jjj", size: 5, position:{x:535, y:540}, velocity:{x:5, y:5}, team:2, hp:50}
	}
bullet_array = [
	 	{size:2, position:{x:230, y:240}, velocity:{x:10, y:10}, lastTime:5, team:blue_team},
	// 	{size:2, position:{x:245, y:245}, lastTime:5, team:2},
	// 	{size:2, position:{x:530, y:535}, lastTime:5, team:1},
	// 	{size:2, position:{x:540, y:550}, lastTime:5, team:2},
	// 	{size:2, position:{x:540, y:540}, lastTime:5, team:1}
	]

var space_grid = []
for(var i = 0; i < map_width/m; ++i){
	space_grid.push([])
	for(var j = 0; j < map_height/n; ++j){
		space_grid[i].push([])
		space_grid[i][j].push([])
	}
}


function distance(pos1, pos2){
	return Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y))
}
//receive data through front end
/*
	tank_data:
	{
		id: string 
		direction_key_press: [bool, bool, bool, bool, bool, bool]  //a, d, w, s, leftarrow, rightarrow, true if press
		team: int
	}
*/
function on_receive(tank_data){
	//todo
	tank_data =  JSON.parse(tank_data)
	console.log(tank_data)
	if(!(tank_data["id"] in tank_list)){
		spawn_pos = tank_data["team"] == blue_team ? {x:20, y:20}:{x:map_width-20, y:map_height-20};
		tank_list[tank_data["id"]] = {id: tank_data["id"], size: 5, position:{x:spawn_pos.x, y:spawn_pos.y}, velocity:{x:0, y:0}, 
			team:tank_data["team"], hp:HP, angle: 0, nextBullet: bulletInterval}
	}

	var curr_tank = tank_list[tank_data["id"]]
	console.log(curr_tank)
	

	vel = {x:curr_tank['velocity'].x, y:curr_tank['velocity'].y};
	if (tank_data['direction_key_press'][0]) vel.x = curr_tank['velocity'].x - accV;
	if (tank_data['direction_key_press'][1]) vel.x = curr_tank['velocity'].x + accV;
	if (tank_data['direction_key_press'][2]) vel.y = curr_tank['velocity'].y + accV;
	if (tank_data['direction_key_press'][3]) vel.y = curr_tank['velocity'].y - accV;

	curr_tank['velocity'].x = vel.x < -VELLIMIT ? -VELLIMIT:(vel.x > VELLIMIT ? VELLIMIT:vel.x);
	curr_tank['velocity'].y = vel.y < -VELLIMIT ? -VELLIMIT:(vel.y > VELLIMIT ? VELLIMIT:vel.y);
	/*
	if(curr_tank.velocity.x >= -VELLIMIT && tank_data["direction_key_press"][0] == true)curr_tank["velocity"].x -= accV;
	if(curr_tank.velocity.x <= VELLIMIT && tank_data["direction_key_press"][1] == true)curr_tank["velocity"].x += accV;
	if(curr_tank.velocity.y <= VELLIMIT && tank_data["direction_key_press"][2] == true)curr_tank["velocity"].y += accV;
	if(curr_tank.velocity.x >= -VELLIMIT && tank_data["direction_key_press"][3] == true)curr_tank["velocity"].y -= accV;
	*/
	if (tank_data["direction_key_press"][4]) curr_tank["angle"] += accA;
	if (tank_data["direction_key_press"][5]) curr_tank["angle"] -= accA;
	curr_tank["angle"] %= 360;

}
//broadcast bullet and tank position
/*
	map_data:{
		tank_dict (dictionary): {id:string, team: int, position: {x:int, y:int}, hp: int, angle:int}
		bullet_list_team1 (list): list [{x:int, y:int}]
		bullet_list_team2 (list): [{x:int, y:int}]
	}

*/

function on_update(){
	for ([k, v] of Object.entries(tank_list)){
		v.position.x += v.velocity.x * s_param
		v.position.y += v.velocity.y * s_param
		v.position.x = v.position.x > map_width ? map_width: (v.position.x < 0 ? 0: v.position.x);
		v.position.y = v.position.y > map_height ? map_height: (v.position.y < 0 ? 0: v.position.y);

		/*
		if(v.velocity.x > 10)v.velocity.x -= 2;
		if(v.velocity.x < -10)v.velocity.x += 2;
		if(v.velocity.y > 10)v.velocity.y -= 2;
		if(v.velocity.y < -10)v.velocity.y += 2;
		*/
		v.velocity.x = v.velocity.x < -VELLIMIT ? -VELLIMIT:(v.velocity.x > VELLIMIT ? VELLIMIT:v.velocity.x);
		v.velocity.y = v.velocity.y < -VELLIMIT ? -VELLIMIT:(v.velocity.y > VELLIMIT ? VELLIMIT:v.velocity.y);

		if(v['nextBullet'] == 0){
			bullet_array.push({
				size: 2,
				position: {x:curr_tank.position.x, y:curr_tank.position.y},
				velocity: {x:10 * Math.cos(curr_tank.angle / 180 * Math.PI) + curr_tank.velocity.x * 0.5, 
					y:10 * Math.cos(curr_tank.angle / 180 * Math.PI + curr_tank.velocity.y * 0.5)},
				team: curr_tank["team"]
			})
			v['nextBullet'] = bulletInterval
		}
		else {
			v['nextBullet'] -= 1
		}
		
		
	}
	

	for (var i = 0; i < bullet_array.length; ++i){
		bullet_array[i].position.x += bullet_array[i].velocity.x * s_param
		bullet_array[i].position.y += bullet_array[i].velocity.y * s_param
	}



	collision_detection()
}


function on_send(){
	on_update()
	var tank_data_send = {}
	var bullet_list_team1 = []
	var bullet_list_team2 = []

	for ([k, v] of Object.entries(tank_list)){
		tank_data_send[k] = {'id':v.id, 'team':v.team, 'position':v.position, 'hp':v.hp, angle:v.angle}
	}

	for (var i = 0; i < bullet_array.length; ++i){
		if(bullet_array[i].team == blue_team){
			bullet_blue.push({x:bullet_array[i].position.x, y:bullet_array[i].position.y})
		}

		else {
			bullet_red.push({x:bullet_array[i].position.x, y:bullet_array[i].position.y})
		}
	}

	return [tank_data_send, bullet_list_team1, bullet_list_team2]
}

function collision_detection(){
	for(var i = 0; i < map_width/m; ++i)
		for(var j = 0; j < map_height/n; ++j){
			space_grid[i][j] = []
		}
	for ([k, v] of Object.entries(tank_list)) {
		space_grid[Math.floor(v.position.x/m)][Math.floor(v.position.y/n)].push(v)
	}

	for (var i = 0; i < bullet_array.length; ++i) {
		bullet_array[i].lastTime -= 1;
		if(bullet_array[i].lastTime > 0){
			space_grid[Math.floor(bullet_array[i].position.x/m)][Math.floor(bullet_array[i].position.y/n)].push(bullet_array[i])
			
		}
	}

	for ([k, v] of Object.entries(tank_list)) {
		var exit_flag = false
		x_index = Math.floor(v.position.x/m)
		y_index = Math.floor(v.position.y/n)
		for(var ii = x_index - 1; ii <= x_index + 1; ++ii){
			for(var jj = y_index - 1; jj <= y_index + 1; ++jj){
				if(ii >= 0 && ii < m && jj >= 0 && jj < n){
					for (var kk = 0; kk < space_grid[ii][jj].length; ++kk){
						//todo
						
						var tmp = space_grid[ii][jj][kk]
						if(v == tmp)continue
						if (tmp["lastTime"] === undefined){
							
							if(distance(v.position, tmp.position) < v.size + tmp.size){
								bounce = {x: tmp.position.x - v.position.x, y: tmp.position.y - v.position.y}
								v.velocity.x -= bounce.x / (v.size + tmp.size) * 8
								v.velocity.y -= bounce.y / (v.size + tmp.size) * 8
								if(v.team != tmp.team){
									v.hp -= 4;
									tmp.hp -= 4;
									if(tmp.hp <= 0){
										delete tank_list[tmp.id]
										space_grid[ii][jj].splice(kk, 1)
										kk-=1;
									}
									if(v.hp <= 0){
										delete tank_list[v.id]
										space_grid[ii][jj].splice(kk, 1)
										exit_flag = true
										break;
									}
								}
								
							}
							
						}

						else {
							if(distance(v.position, tmp.position) < v.size + tmp.size){
								if(v.team != tmp.team){
									v.hp -= 5;
									tmp.lastTime = -1;
									space_grid[ii][jj].splice(kk, 1)
									kk-=1;
									if(v.hp <= 0){
										delete tank_list[v.id]
										space_grid[ii][jj].splice(kk, 1)
										exit_flag = true
										break;
									}
								}
								
							}
						}
						
					}
					if(exit_flag == true)break;
				}

			}
			if(exit_flag == true)break;
		}
	}

	var curr = 0
	for(var i = 0; i < bullet_array.length; ++i){
		if(bullet_array[i].lastTime > 0){
			bullet_array[curr] = bullet_array[i]
			curr += 1
		}
	}
	bullet_array.splice(curr, bullet_array.length - curr)
}

function test(){

	

	on_receive('{"id": "ccc", "team":2, "has_new_bullet":true, "direction_key_press":[true, false, true, false]}')
	on_receive('{"id": "ccc", "team":2, "has_new_bullet":false, "direction_key_press":[true, false, true, false]}')
	on_receive('{"id": "ccc", "team":2, "has_new_bullet":false, "direction_key_press":[true, false, true, false]}')
	on_receive('{"id": "ccc", "team":2, "has_new_bullet":false, "direction_key_press":[true, false, true, false]}')
	on_receive('{"id": "ccc", "team":2, "has_new_bullet":true, "direction_key_press":[true, false, true, false]}')
	

	// on_update()
	// on_update()
	// on_update()
	// on_update()
	// on_update()
	// on_update()
	// on_update()

	console.log(tank_list)
	console.log(bullet_array)


}
module.exports = {
	on_receive,
	on_send
};
//test()