
var tank_list = {} //id, tank.size, tank.position, tank.velocity, tank.team, tank.hp
var bullet_array = [] //bullet: size, position, velocity, lastTime, team
var map_width = 800
var map_height = 800
var m = 20
var n = 20
var space_grid = []

//receive data through front end
/*
	tank_data:
	{
		id: string 
		position: {x:int, y:int}
		direction_key_press: [bool, bool, bool, bool]  //left, right, up, down, true if press
		cannon_direction: int
		has_new_bullet: bool
		team: int
	}
*/
function on_receive(tank_data){
	//todo
	//update position, 

}
//broadcast bullet and tank position
/*
	map_data:{
		tank_dict (dictionary): key: id(string), value: {team: int, position: {x:int, y:int}}
		bullet_list_team1 (list): list [{x:int, y:int}]
		bullet_list_team2 (list): [{x:int, y:int}]
	}

*/
function on_send(){

}



function distance(pos1, pos2){
	return Math.sqrt((pos1.x - pos2.x) * (pos1.x - pos2.x) + (pos1.y - pos2.y) * (pos1.y - pos2.y))
}


for(var i = 0; i < map_width/m; ++i){
	space_grid.push([])
	for(var j = 0; j < map_height/n; ++j){
		space_grid[i].push([])
		space_grid[i][j].push([])
	}
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
						console.log(v)
						console.log(tmp)
						console.log(ii, jj, kk, space_grid[ii][jj].length)
						console.log('dfa')
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
	tank_list = {
		"aaa" : {id: "aaa", size: 5, position:{x:230, y:230}, velocity:{x:5, y:5}, team:1, hp:50},
		"bbb" : {id: "bbb", size: 5, position:{x:230, y:235}, velocity:{x:5, y:5}, team:2, hp:50}
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
	 	{size:2, position:{x:230, y:240}, lastTime:5, team:1},
	// 	{size:2, position:{x:245, y:245}, lastTime:5, team:2},
	// 	{size:2, position:{x:530, y:535}, lastTime:5, team:1},
	// 	{size:2, position:{x:540, y:550}, lastTime:5, team:2},
	// 	{size:2, position:{x:540, y:540}, lastTime:5, team:1}
	]
	collision_detection()
	collision_detection()

	console.log(tank_list)
	console.log(bullet_array)


}

test()