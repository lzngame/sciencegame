game = window.game || {};

game.monsterdata = new function(){
	var self = this;
	self.monster04_atlas = null;
	self.monster20_atlas = null;
	self.soliderhero_atlas = null;
	self.oldmannpc_atlas = null;
	self.updataFunc = [];
	
	self.bugbossUpdate =  function(obj) {
			if (obj.framename == 'idle') {
				if(!obj.iswin)
					obj.sumtime += game.clock.fpstick;
				if (obj.sumtime > 1500 && (obj.sumtime % 2 == 0)) {
					obj.switchState('attack', 6);
					obj.sumtime = 0;
				}
				if(obj.sumtime > 2000){
					obj.switchState('blockidle',6);
				}
			}
			if(obj.framename == 'attack' && obj.currentFrame == obj.attackKeyFrame){
				if(obj.sendcd){
					obj.sendMsg(game.currentScene.hero, game.configdata.MSAGE_TYPE.behit, {attacktype:'attack',attackvalue:obj.attackPower});
					obj.sendcd = false;
					console.log('monster attack');
				}
			}
			obj.atLastFrame();
		};
	
	self.dragonUpdate =  function(obj) {
			if (obj.framename == 'idle') {
				if(!obj.iswin)
					obj.sumtime += game.clock.fpstick;
				if (obj.sumtime > 2500 && (obj.sumtime % 2 == 0)) {
					if(Math.random() > 0.5){
						obj.switchState('attack', 6);
						obj.sumtime = 0;
					}
				}
				if (obj.sumtime > 2500 && (obj.sumtime % 2 != 0)) {
					if(Math.random() > 0.5){
						obj.switchState('magic', 6);
						obj.sumtime = 0;
					}
				}
			}
			if(obj.currentFrame == obj.attackKeyFrame){
				var thetype  = 'attack';
				if(obj.framename == 'attack'){
					thetype  = 'attack';
				}else{
					thetype  = 'magic';
				}
				if(obj.sendcd && (obj.framename == 'magic' || obj.framename == 'attack')){
					obj.sendMsg(game.currentScene.hero, game.configdata.MSAGE_TYPE.behit, {attacktype:thetype,attackvalue:obj.attackPower});
					obj.sendcd = false;
					console.log('monster attack');
				}
			}
			obj.atLastFrame();
		};
	
	self.normalUpdate =  function(obj) {
			if (obj.framename == 'idle') {
				if(!obj.iswin)
					obj.sumtime += game.clock.fpstick;
				if (obj.sumtime > 1500 && (obj.sumtime % 2 == 0)) {
					obj.switchState('attack', 6);
					obj.sumtime = 0;
				}else if (obj.sumtime > 1500 && (obj.sumtime % 2 != 0)){
					obj.switchState('shield', 6);
					obj.sumtime = 0;
				}
			}
			if(obj.framename == 'attack' && obj.currentFrame == obj.attackKeyFrame){
				if(obj.sendcd){
					obj.sendMsg(game.currentScene.hero, game.configdata.MSAGE_TYPE.behit, {attacktype:'attack',attackvalue:obj.attackPower});
					obj.sendcd = false;
				}
			}
			obj.atLastFrame();
		};
		
	self.batlUpdate =  function(obj) {
			if (obj.framename == 'idle') {
				if(!obj.iswin)
					obj.sumtime += game.clock.fpstick;
				if (obj.sumtime > 1500 && (obj.sumtime % 2 == 0)) {
					obj.switchState('attack', 6);
					obj.sumtime = 0;
				}
			}
			if(obj.framename == 'attack' && obj.currentFrame == obj.attackKeyFrame){
				if(obj.sendcd){
					obj.sendMsg(game.currentScene.hero, game.configdata.MSAGE_TYPE.behit, {attacktype:'attack',attackvalue:obj.attackPower});
					obj.sendcd = false;
					console.log('monster attack');
				}
			}
			obj.atLastFrame();
		};
		
	self.normalUpdate2 =  function(obj) {
			if (obj.framename == 'idle') {
				if(obj.hatred >= 100){
					obj.switchState('attack', 6);
					obj.hatred = 0;
				}
				if(!obj.iswin)
					obj.sumtime += game.clock.fpstick;
				if (obj.sumtime > 1500 && (obj.sumtime % 2 == 0)) {
					obj.switchState('attack', 6);
					obj.sumtime = 0;
				}else if (obj.sumtime > 1500 && (obj.sumtime % 2 != 0)){
					obj.switchState('shield', 6);
					obj.sumtime = 0;
				}
			}
			if(obj.framename == 'attack' && obj.currentFrame == obj.attackKeyFrame){
				if(obj.sendcd){
					obj.sendMsg(game.currentScene.hero, game.configdata.MSAGE_TYPE.behit, {attacktype:'attack',attackvalue:obj.attackPower});
					obj.sendcd = false;
				}
			}
			obj.atLastFrame();
		};
	self.inAttackKeyFrame = function(obj){
		
	};
	self.behit = function(power,obj){
		obj.switchState('behit', 5);
		obj.x = (obj.initx+5);
		addEffect(obj,'sword2');
		getLostBlood(power,-1,obj.x+45,obj.y+10,obj.y,obj.y+50).addTo(obj.parent);
		obj.hp -= power;
		if(obj.hp < 0)
			obj.hp = 0;
		console.log('after hit:%d',obj.hp);
		if (obj.hp <= 0) {
			obj.switchState('dead', 4);
			obj.loop = false;
		}
		obj.sendMsg(game.currentScene,game.configdata.MSAGE_TYPE.monseterLostHp,[obj.hp,power]);
	}
	
	self.behit2 = function(power,obj){
		console.log('------hatred------');
		obj.hatred+= 100;
		self.behit(power,obj);
	}
	
	self.behit3 = function(power,obj){
		if(obj.hp <= power && !obj.relive){
			obj.switchState('playdead', 4);
			obj.relive = true;
		}else{
			self.behit(power,obj);
		}
	}
	
	self.frameInfos = {
		bugboss_monster13:{
			name:'monster13',w:912,h:1442,tileW:128,tileH:128,
			frames:[[2, 142, 128, 128], [132, 142, 128, 128], [262, 142, 128, 128], [392, 142, 128, 128], [522, 142, 128, 128], [2, 272, 128, 128], [132, 272, 128, 128], [262, 272, 128, 128], [392, 272, 128, 128], [522, 272, 128, 128], [2, 402, 128, 128], [132, 402, 128, 128], [262, 402, 128, 128], [392, 402, 128, 128], [522, 402, 128, 128], [2, 532, 128, 128], [132, 532, 128, 128], [262, 532, 128, 128], [392, 532, 128, 128], [522, 532, 128, 128], [652, 532, 128, 128], [782, 532, 128, 128], [2, 662, 128, 128], [132, 662, 128, 128], [262, 662, 128, 128], [392, 662, 128, 128], [522, 662, 128, 128], [652, 662, 128, 128], [782, 662, 128, 128], [2, 792, 128, 128], [132, 792, 128, 128], [262, 792, 128, 128], [2, 922, 128, 128], [132, 922, 128, 128], [262, 922, 128, 128], [392, 922, 128, 128], [522, 922, 128, 128], [652, 922, 128, 128], [782, 922, 128, 128], [2, 1052, 128, 128], [132, 1052, 128, 128], [262, 1052, 128, 128], [392, 1052, 128, 128], [522, 1052, 128, 128], [652, 1052, 128, 128], [2, 1182, 128, 128], [132, 1182, 128, 128], [262, 1182, 128, 128], [392, 1182, 128, 128], [522, 1182, 128, 128], [652, 1182, 128, 128], [782, 1182, 128, 128], [2, 1312, 128, 128], [132, 1312, 128, 128], [262, 1312, 128, 128], [392, 1312, 128, 128], [522, 1312, 128, 128]],
			sprites:{
				blockidle: {from:0,to:6},
				idle:{from:7,to:17},
				getweek:{from:32,to:38},
				weekidel:{from:39,to:44},
				attack: {from:18,to:31},
				behit: [32, 33, 34],
				dead: {from:45,to:51},
			},
		},
		bat_02:{
			name:'monster02',w:860,h:340,tileW:64,tileH:64,
			frames:[[2, 142, 64, 64], [68, 142, 64, 64], [134, 142, 64, 64], [200, 142, 64, 64], [266, 142, 64, 64], [332, 142, 64, 64], [398, 142, 64, 64], [464, 142, 64, 64], [2, 208, 64, 64], [68, 208, 64, 64], [134, 208, 64, 64], [200, 208, 64, 64], [266, 208, 64, 64], [332, 208, 64, 64], [398, 208, 64, 64], [464, 208, 64, 64], [530, 208, 64, 64], [596, 208, 64, 64], [662, 208, 64, 64], [728, 208, 64, 64], [794, 208, 64, 64], [2, 274, 64, 64], [68, 274, 64, 64], [134, 274, 64, 64], [200, 274, 64, 64], [266, 274, 64, 64], [332, 274, 64, 64], [398, 274, 64, 64], [464, 274, 64, 64], [530, 274, 64, 64], [596, 274, 64, 64], [662, 274, 64, 64], [728, 274, 64, 64]],
			sprites:{
				idle: {from:0,to:7},
				attack: {from:7,to:20},
				shield: {from:5,to:7},
				behit: [22, 23, 25],
				dead: {from:21,to:32},
			},
		},
		monster04:{
			name:'monster04',w:992,h:464,tileW:64,tileH:64,
			frames: [[2, 134, 64, 64], [68, 134, 64, 64], [134, 134, 64, 64], [200, 134, 64, 64], [266, 134, 64, 64], [2, 200, 64, 64], [68, 200, 64, 64], [134, 200, 64, 64], [200, 200, 64, 64], [266, 200, 64, 64], [332, 200, 64, 64], [398, 200, 64, 64], [464, 200, 64, 64], [530, 200, 64, 64], [596, 200, 64, 64], [662, 200, 64, 64], [2, 266, 64, 64], [68, 266, 64, 64], [134, 266, 64, 64], [200, 266, 64, 64], [266, 266, 64, 64], [332, 266, 64, 64], [2, 332, 64, 64], [68, 332, 64, 64], [134, 332, 64, 64], [200, 332, 64, 64], [266, 332, 64, 64], [332, 332, 64, 64], [398, 332, 64, 64], [464, 332, 64, 64], [530, 332, 64, 64], [596, 332, 64, 64], [662, 332, 64, 64], [728, 332, 64, 64], [794, 332, 64, 64], [860, 332, 64, 64], [926, 332, 64, 64], [2, 398, 64, 64], [68, 398, 64, 64], [134, 398, 64, 64]],
			sprites: {
					idle: [0, 1, 2, 3, 4],
					attack: {from: 5,to: 15},
					shield: [16, 17, 18, 19, 20, 20, 21],
					behit: [23, 24, 24],
					dead: {from:22,to:39}
				}
		},


		monster05:{
			name:'monster05',w:860,h:480,tileW:64,tileH:64,
			frames:[[2, 150, 64, 64], [68, 150, 64, 64], [134, 150, 64, 64], [200, 150, 64, 64], [266, 150, 64, 64], [332, 150, 64, 64], [398, 150, 64, 64], [464, 150, 64, 64], [2, 216, 64, 64], [68, 216, 64, 64], [134, 216, 64, 64], [200, 216, 64, 64], [266, 216, 64, 64], [332, 216, 64, 64], [398, 216, 64, 64], [464, 216, 64, 64], [530, 216, 64, 64], [596, 216, 64, 64], [662, 216, 64, 64], [728, 216, 64, 64], [2, 282, 64, 64], [68, 282, 64, 64], [134, 282, 64, 64], [200, 282, 64, 64], [266, 282, 64, 64], [332, 282, 64, 64], [398, 282, 64, 64], [464, 282, 64, 64], [530, 282, 64, 64], [2, 348, 64, 64], [68, 348, 64, 64], [134, 348, 64, 64], [200, 348, 64, 64], [266, 348, 64, 64], [332, 348, 64, 64], [398, 348, 64, 64], [464, 348, 64, 64], [530, 348, 64, 64], [596, 348, 64, 64], [662, 348, 64, 64], [728, 348, 64, 64], [794, 348, 64, 64], [2, 414, 64, 64], [68, 414, 64, 64], [134, 414, 64, 64], [200, 414, 64, 64], [266, 414, 64, 64], [332, 414, 64, 64], [398, 414, 64, 64], [464, 414, 64, 64], [530, 414, 64, 64], [596, 414, 64, 64], [662, 414, 64, 64], [728, 414, 64, 64], [794, 414, 64, 64]],
			sprites: {
				idle: {from:0,to:7},
				attack: {from:8,to:19},
				shield: {from:20,to:28},
				behit: [29, 30, 31],
				dead: {from:29,to:41},
				playdead: {from:29,to:41},
				relive:{from:42,to:54}
			}
		},
		monster20:{
			name:'monster20',w:982,h:472,tileW:96,tileH:64,
			frames:[[2, 142, 96, 64], [100, 142, 96, 64], [198, 142, 96, 64], [296, 142, 96, 64], [394, 142, 96, 64], [492, 142, 96, 64], [590, 142, 96, 64], [2, 208, 96, 64], [100, 208, 96, 64], [198, 208, 96, 64], [296, 208, 96, 64], [394, 208, 96, 64], [492, 208, 96, 64], [590, 208, 96, 64], [688, 208, 96, 64], [786, 208, 96, 64], [884, 208, 96, 64], [2, 274, 96, 64], [100, 274, 96, 64], [198, 274, 96, 64], [296, 274, 96, 64], [2, 340, 96, 64], [100, 340, 96, 64], [198, 340, 96, 64], [296, 340, 96, 64], [394, 340, 96, 64], [492, 340, 96, 64], [590, 340, 96, 64], [688, 340, 96, 64], [786, 340, 96, 64], [884, 340, 96, 64], [2, 406, 96, 64], [100, 406, 96, 64], [198, 406, 96, 64], [296, 406, 96, 64]],
			sprites:{
					idle: [0, 1, 2, 3, 4, 5, 6],
					attack: {from: 8,to: 17},
					shield: [18, 19, 19, 19, 20, 20, 21],
					behit: [23, 24, 25],
					dead: [22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 31, 33, 34, 34, 34, 34, 34]
				}
		},
		monster19:{    //dragon
			name:'monster19',w:912,h:802,tileW:128,tileH:64,
			frames:[[2, 142, 128, 64], [132, 142, 128, 64], [262, 142, 128, 64], [392, 142, 128, 64], [522, 142, 128, 64], [652, 142, 128, 64], [782, 142, 128, 64], [2, 208, 128, 64], [132, 208, 128, 64], [262, 208, 128, 64], [392, 208, 128, 64], [522, 208, 128, 64], [2, 274, 128, 64], [132, 274, 128, 64], [262, 274, 128, 64], [392, 274, 128, 64], [522, 274, 128, 64], [652, 274, 128, 64], [782, 274, 128, 64], [2, 340, 128, 64], [132, 340, 128, 64], [262, 340, 128, 64], [2, 406, 128, 64], [132, 406, 128, 64], [262, 406, 128, 64], [392, 406, 128, 64], [522, 406, 128, 64], [652, 406, 128, 64], [782, 406, 128, 64], [2, 472, 128, 64], [132, 472, 128, 64], [262, 472, 128, 64], [392, 472, 128, 64], [522, 472, 128, 64], [652, 472, 128, 64], [782, 472, 128, 64], [2, 538, 128, 64], [132, 538, 128, 64], [2, 604, 128, 64], [132, 604, 128, 64], [262, 604, 128, 64], [392, 604, 128, 64], [522, 604, 128, 64], [652, 604, 128, 64], [782, 604, 128, 64], [2, 670, 128, 64], [132, 670, 128, 64], [262, 670, 128, 64], [392, 670, 128, 64], [522, 670, 128, 64], [652, 670, 128, 64], [782, 670, 128, 64], [2, 736, 128, 64], [132, 736, 128, 64]],
			sprites:{
					idle: {from:0,to:11},
					attack: {from: 12,to: 21},
					magic:{from:22,to:37},
					behit: [38, 39],
					dead: {from:38,to:53}
				}
		}
	};
		
	self.monsters ={
		100:{shield_offsetx:28,shield_offsety:40,hit_offsetx:35,hit_offsety:35,index:100,attackKeyFrame:13,updateFunc:this.bugbossUpdate,behit:this.behit,floory:35,isboss:true},
		2:{shield_offsetx:28,shield_offsety:40,hit_offsetx:35,hit_offsety:35,index:2,attackKeyFrame:5,updateFunc:this.batlUpdate,behit:this.behit,floory:100},
		4:{shield_offsetx:28,shield_offsety:40,hit_offsetx:35,hit_offsety:35,index:4,attackKeyFrame:5,updateFunc:this.normalUpdate,behit:this.behit,floory:100},
		5:{shield_offsetx:28,shield_offsety:40,hit_offsetx:35,hit_offsety:35,index:5,attackKeyFrame:9,updateFunc:this.normalUpdate,behit:this.behit3,floory:100},
		20:{shield_offsetx:45,shield_offsety:30,hit_offsetx:55,hit_offsety:25,index:20,attackKeyFrame:7,updateFunc:this.normalUpdate2,behit:this.behit2,floory:100},
		19:{shield_offsetx:45,shield_offsety:30,hit_offsetx:55,hit_offsety:25,index:19,attackKeyFrame:7,updateFunc:this.dragonUpdate,behit:this.behit,floory:100},
		
	};
	
	self.getMonsterAtlas = function(index){
		switch(index){
			case 4:
				return self.createAtlas(self.frameInfos.monster04);
				break;
			case 5:
				return self.createAtlas(self.frameInfos.monster05);
				break;
			case 19:  //dragon
				return self.createAtlas(self.frameInfos.monster19);
				break;
			case 20:
				return self.createAtlas(self.frameInfos.monster20);
				break;
			case 2:
				return self.createAtlas(self.frameInfos.bat_02);
				break;
			case 100:
				return self.createAtlas(self.frameInfos.bugboss_monster13);
				break;
		}
	},
	
	self.init = function(){
		console.log('monster data init');
	};
	
	self.initAtlas = function(){
		var img = game.getImg('boys');
		self.soliderhero_atlas = new Hilo.TextureAtlas({
				image: img,
				width: 4096,
				height: 2048,
				frames: [
					[1119, 1524, 373, 381],
					[1119, 1143, 373, 381],
					[1119, 762, 373, 381],
					[1119, 381, 373, 381],
					[1119, 0, 373, 381],
					[746, 1524, 373, 381], //walk 0-5
					
					[0, 0, 373, 381],  //squat 6
					
					[746, 1143, 373, 381],  
					[1865, 381, 373, 381],  //idle 7-8
					
					[0,1143,373,381],//jump 9
					
					[373,1524,373,381],//arm 10
					
					[68, 2, 64, 64],
					[134, 2, 64, 64],
					[200, 2, 64, 64],
					[266, 2, 64, 64],
					[2, 68, 64, 64],
					[68, 68, 64, 64],
					[2, 134, 64, 64],
					[68, 134, 64, 64],
					[2, 200, 64, 64],
					[68, 200, 64, 64],
					[134, 200, 64, 64],
					[200, 200, 64, 64],
					[266, 200, 64, 64],
					[332, 200, 64, 64],
					[398, 200, 64, 64],
					[464, 200, 64, 64],
					[2, 266, 64, 64],
					[68, 266, 64, 64],
					[134, 266, 64, 64],
					[200, 266, 64, 64],
					[266, 266, 64, 64],
					[332, 266, 64, 64],
					[398, 266, 64, 64],
					[464, 266, 64, 64],
					[530, 266, 64, 64],
					[2, 332, 64, 64],
					[68, 332, 64, 64],
					[134, 332, 64, 64],
					[200, 332, 64, 64],
					[266, 332, 64, 64],
					[332, 332, 64, 64],
					[398, 332, 64, 64],
					[464, 332, 64, 64],
					[530, 332, 64, 64],
					[2, 398, 64, 64],
					[68, 398, 64, 64],
					[134, 398, 64, 64],
					[200, 398, 64, 64],
					[266, 398, 64, 64],
					[332, 398, 64, 64],
					[398, 398, 64, 64],
					[464, 398, 64, 64],
					[530, 398, 64, 64],
					[2, 464, 64, 64],
					[68, 464, 64, 64],
					[134, 464, 64, 64],
					[200, 464, 64, 64],
					[266, 464, 64, 64],
					[332, 464, 64, 64],
					[398, 464, 64, 64],
					[464, 464, 64, 64],
					[530, 464, 64, 64],
					[2, 530, 64, 64],
					[68, 530, 64, 64],
					[134, 530, 64, 64],
					[200, 530, 64, 64],
					[266, 530, 64, 64],
					[332, 530, 64, 64],
					[398, 530, 64, 64],
					[464, 530, 64, 64],
					[530, 530, 64, 64],
					[596, 530, 64, 64],
					[2, 596, 64, 64],
					[68, 596, 64, 64],
					[134, 596, 64, 64],
					[200, 596, 64, 64],
					[266, 596, 64, 64],
					[332, 596, 64, 64],
					[398, 596, 64, 64],
					[464, 596, 64, 64],
					[530, 596, 64, 64],
					[596, 596, 64, 64],
					[662, 596, 64, 64],
					[728, 596, 64, 64],
					[794, 596, 64, 64],
					[860, 596, 64, 64],
					[926, 596, 64, 64],
					[2, 662, 64, 64],
					[68, 662, 64, 64],
					[134, 662, 64, 64],
					[200, 662, 64, 64],
					[266, 662, 64, 64],
					[332, 662, 64, 64],
					[398, 662, 64, 64],
					[464, 662, 64, 64],
					[530, 662, 64, 64],
					[596, 662, 64, 64],
					[662, 662, 64, 64],
					[728, 662, 64, 64],
					[794, 662, 64, 64],
					[860, 662, 64, 64],
					[926, 662, 64, 64]
				],
				sprites: {
					walk:[0,1,2,3,4,5],
					idle: [7,7,8,8],
					squat:[6,6],
					jump:[9,9],
					handon:[10,10],
					attack: {from: 17,to: 25},
					behit:[5,5,6,6],
					dead:{from:63,to:92},
					shield:{from:9,to:16},
					frozen:[7,7],
					petrify:[8,8],
					magic:{from:35,to:43},
					win:[53,54,55,56,57,58,59,60,61,62,53,54,55,56,57,58,59,60,61,62,62,62],
				}
			});
	};
	
	self.createAtlas = function(data){
		var atlas = new Hilo.TextureAtlas({
			image: game.getImg(data.name),
			width: data.w,
			height: data.h,
			frames:data.frames,
			sprites:data.sprites,
		});
		return atlas;
	};
};

//-----------
(function(ns) {
	var UserInfo = ns.UserInfo = Hilo.Class.create({
		goldboxNum:300,
		goldcoinNum:15399,
		name:'Jack',
		password:'password',
		currentPointIndex:0,
		finishAchieve:null,
		constructor: function(properties) {
			this.init(properties);
		},
		init: function(properties) {
			console.log('user data init');
			this.reset();
		},
		
		reset: function() {
			this.goldboxNum = 300;
			this.goldcoinNum = 15399;
			this.name = 'Jack';
			this.password = 'password';
			this.currentPointIndex = 0;
			this.finishAchieve = [[0,1],[1,1],[2,0]];
		},
	});
})(window.game);

//-----------
(function(ns) {
	var HeroData = ns.HeroData = Hilo.Class.create({
		hp:-1,
		totalhp:-1,
		lv:-1,
		power:-1,
		nimble:-1,
		buffer:-1,
		start:-1,
		magic:-1,
		attackCd:-1,
		storedata:null,
		bagdata:null,
		lockdata:null,
		doorsState:null,
		activePointIndex:-1,
		killMonsters:-1,
		winPoints:-1,
		critialRatio:-1,
		missRatio:-1,
		constructor: function(properties) {
			this.init(properties);
		},
		init: function(properties) {
			console.log('hero data init');
			this.storedata = [
   				 1,2,3,4,5,0,
  				 2,10,11,3,4,5,
				];

 			this.bagdata = [
 				[1,4,12,13],[1,3]
			];

			this.lockdata = [
				0,0,0,0,0,0,0,
				0,0,0,0,0,0,0,
				0,0,0,0,0,0,0
			];
			this.doorsState  = [
				  {open:true, state:0,doorIndex:0},
				  {open:false,state:0,doorIndex:1},
				  {open:false,state:0,doorIndex:2},
				  {open:false,state:0,doorIndex:3},
				  {open:false,state:0,doorIndex:4},
				  {open:false,state:0,doorIndex:5},
				  {open:false,state:0,doorIndex:6},
				  {open:false,state:0,doorIndex:7},
			];
			
			this.totalhp = 100;
			this.hp = this.totalhp;
			this.star = 0;
			this.power= 20;
			this.nimble=2;
			this.exp=200;
			this.lv=5;
			this.magic=4;
			this.attackCd=1000;
			this.activeDoorIndex = 0;
			this.killMonsters = 0;
			this.killBosses = 0;
			this.winPoints =0;
			this.critialRatio = 0.99;
			this.missRatio = 0.4;
		},
		unlock:function(kind,index){
			if(kind >2)
				kind = 2;
			if(index > 6)
				index = 6;
			var arrayIndex = kind * 3 + index;
			this.lockdata[arrayIndex] = 1;
			game.userData.saveHeroDataJsonSt();
		},
		reset: function() {
			this.data.hp = 8;
		},
	});
})(window.game);



