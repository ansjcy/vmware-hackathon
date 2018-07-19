/*
	 {
		id: string
		pos: {x:numeric, y:numeric}
		key_direction: int // 0,1,2,3
		cannon_angle: numeric
		is_bullet: bool
		team: bool
		fired: bool
	}
*/

var XLIMIT = 100;
var TLIMIT = 100;
var ACC = 0.5;
var VELLIMIT = 10;
var EP = 0.5;
var HEALTH = 5;
var QUANTUM = 0.01;
var B_VEL = 10;

var t1 = JSON.parse('{"id": "10tank", "pos": [4.5, 10.2], "key_direction": 1, "cannon_angle": 30, "is_bullet": 0, "team": 1, "fired": 1}')
var t2 = JSON.parse('{"id": "102bullet", "pos": [1, 2], "key_direction": -1, "cannon_angle": null, "is_bullet": 1, "team": null, "fired": null}')

/* 
	tank: id -> [[x, y], [vx, vy], hp]
	bullet: id -> [[x, y], [vx, vy], hp] 
*/
var tank_pos = {};
var bullet_pos = {};

function update_tank_pos(obj) {
	// new spawn
	if (obj['is_bullet'] == 0 && !(obj['id'] in tank_pos)) {
		tank_pos['id'] = [obj['pos'], [0,0], HEALTH];
	}
	// update loc
	console.log('old loc: ' + tank_pos['id']);

	switch(obj['key_direction']) {
		case 0: 
			console.log('UP loc: ' + tank_pos['id']);
			tank_pos['id'][0][1] += QUANTUM*tank_pos['id'][1][1] + 0.5*QUANTUM^2*ACC;
			tank_pos['id'][1][1] += QUANTUM * ACC; 
			break; // Up
		case 1: 
			console.log('Down loc: ' + tank_pos['id']);
			tank_pos['id'][0][1] -= QUANTUM*tank_pos['id'][1][1] - 0.5*QUANTUM^2*ACC;
			tank_pos['id'][1][1] -= QUANTUM * ACC;
			break; // Down
		case 2: 
			console.log('new Left: ' + tank_pos['id']);
			tank_pos['id'][0][0] -= QUANTUM*tank_pos['id'][1][0] - 0.5*QUANTUM^2*ACC;
			tank_pos['id'][1][0] -= QUANTUM * ACC;
			break; // Left
		case 3: 
			console.log('new Right: ' + tank_pos['id']);
			tank_pos['id'][0][0] += QUANTUM*tank_pos['id'][1][0] + 0.5*QUANTUM^2*ACC;
			tank_pos['id'][1][0] += QUANTUM * ACC; 
			break; // Right
	}

	console.log('new loc: ' + tank_pos['id']);
	/* TO DO: calculate the x&y velocity based on given angel*/
	if (obj['fired']) {
		console.log('this tank fired');

	}
	// collision_deprived(obj);
	// return;
}

function update_bullet_pos(obj) {
	// new spawn
	if (obj['is_bullet'] == 1 && !(obj['id'] in bullet_pos)) {
		bullet_pos['id'] = [obj['pos'], [0,0], HEALTH];
	}
	console.log('old bullet loc: ' + bullet_pos['id']);
	bullet_pos['id'][0][0] += bullet_pos['id'][1][0]*QUANTUM;
	bullet_pos['id'][0][1] += bullet_pos['id'][1][1]*QUANTUM;
	console.log('new bullet loc: ' + bullet_pos['id']);
}

/* obj = [id, x, y] */
function collision_deprived(obj) {
	var hits = 0;
	for (var k in bullet_positions) {
		if (k[0] == obj[0]) { continue; }
		if (Math.abs(obj[1]-k[1]) < EP && Math.abs(obj[2]-k[2]) < EP) { hits ++; }
	}
	return hits;
}

/* TEST */
update_tank_pos(t1);
update_bullet_pos(t2);