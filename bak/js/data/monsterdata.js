game = window.game || {};

game.monsterdata = new function(){
	var self = this;
	self.monster04_atlas = null;
	self.monster20_atlas = null;
	self.soliderhero_atlas = null;
	self.oldmannpc_atlas = null;
	self.effect_atlas = null;
	self.stive_atlas = null;
	self.updataFunc = [];
	
	
	self.init = function(){
		console.log('monster data init');
	};
	
	self.initAtlas = function(){
		var img = game.getImg('boyaction');
		self.soliderhero_atlas = new Hilo.TextureAtlas({
				image: img,
				width: 2048,
				height: 2048,
				frames:[[0, 312, 210, 310], [0, 0, 210, 310], [1272, 624, 210, 310], [0, 936, 210, 310], [1925, 1937, 61, 63], [1925, 1872, 61, 63], [212, 0, 210, 310], [212, 312, 210, 310], [212, 624, 210, 310], [212, 936, 210, 310], [212, 1248, 210, 310], [1272, 312, 210, 310], [700, 1872, 173, 153], [875, 1872, 173, 153], [1050, 1872, 173, 153], [1225, 1872, 173, 153], [175, 1872, 173, 153], [350, 1872, 173, 153], [525, 1872, 173, 153], [350, 1872, 173, 153], [1400, 1872, 173, 153], [1575, 1872, 173, 153], [0, 1872, 173, 153], [1750, 1872, 173, 153], [1272, 936, 210, 310], [212, 1560, 210, 310], [424, 0, 210, 310], [424, 312, 210, 310], [424, 624, 210, 310], [1272, 0, 210, 310], [2120, 312, 210, 310], [2120, 0, 210, 310], [1908, 1248, 210, 310], [1908, 1560, 210, 310], [1908, 936, 210, 310], [1696, 1248, 210, 310], [1908, 624, 210, 310], [636, 1248, 210, 310], [636, 936, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [1484, 1560, 210, 310], [1484, 1248, 210, 310], [1484, 936, 210, 310], [1484, 624, 210, 310], [424, 936, 210, 310], [424, 1248, 210, 310], [424, 1560, 210, 310], [0, 1248, 210, 310], [0, 1560, 210, 310], [1696, 624, 210, 310], [1696, 936, 210, 310], [1272, 1248, 210, 310], [1696, 312, 210, 310], [1696, 0, 210, 310], [848, 936, 210, 310], [848, 624, 210, 310], [2083, 1946, 45, 75], [2036, 1946, 45, 75], [1988, 1946, 46, 72], [1988, 1872, 46, 72], [2036, 1872, 46, 72], [848, 312, 210, 310], [848, 0, 210, 310], [636, 1560, 210, 310], [0, 624, 210, 310], [1060, 1560, 210, 310], [1060, 1248, 210, 310], [1484, 312, 210, 310], [1484, 0, 210, 310], [1272, 1560, 210, 310], [1908, 312, 210, 310], [1908, 0, 210, 310], [1696, 1560, 210, 310], [1060, 936, 210, 310], [1060, 624, 210, 310], [1060, 312, 210, 310], [1060, 0, 210, 310], [848, 1560, 210, 310], [848, 1248, 210, 310]],
				sprites: {
					idle: [28,24,28,24,24,24,24,24,25,26,27,28,28,28,28,28],
					walk:{from:75,to:80},
					turn180:[69,70,71,66,67,68],
					turn1802:[68,67,66,71,70,69],
					backpick:[0,1,2,3],
					idleback:[68,68],
					handup:[8,8],
					knockladder:[29,30,31,32],
					onTopladder:[41,40,39,38,37],
					downTopladder:[37,38,39,40,41],
					upladder:[6,7,8,9,10,11],
					downladder:[11,10,9,8,7,6],
					fallladder:[68,6,7,34,33,35,36,36],
					prybox:[51,52,53,54,55],
					takeRightobj:[69,70,71,56,57],
					takebackput:[69,70,71,66,67,68,0,1,2,3],
					takebackputjack:[69,70,71,66,67,68,0,1,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3],
					upjack:[72,73,74],
					nocan:[28,28,28,42,43,44,45],
					
					dogidle:[20,21,22,23],
					dogeat:[16,17,18,19],
					dogangry:[12,13,14,15],
					
					snailidle:[58,59],
					snailtouch:[60,61,62],
					
					bee:[4,5],
				}
			});
			
			var effectimg = game.getImg('effect2');
			self.effect_atlas = new Hilo.TextureAtlas({
				image: effectimg,
				width: 2048,
				height: 2048,
				frames: [
					[1000,1224,156,403],
                	[1000,408,156,403],
                	[1000,0,156,403],
                	[1000,1632,156,403],
                	[1000,816,156,403],      //0-4   corridor fire
					
					[0, 650, 995, 320], 
					[0, 1300, 995, 320], 
					[0, 975, 995, 320], 
					[0, 1625, 995, 320], 
					[0, 325, 995, 320], 
					[0, 0, 995, 320],    //5-10  smokewall
					
					[1161,528,154,171],
					[1161,0,154,171],
					[1161,176,154,171],
					[1161,352,154,171],  //11-14 gas effect
				],
				sprites: {
					corridorfireeffect:[0,1,2,3,4],
					smokewalleffect:[5,6,7,8,9,10],
					gaseffect:[11,12,13,14]
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
	var BoyData = ns.BoyData = Hilo.Class.create({
		currentHp:0,
		bagdata:[],
		bedroomData:null,
		passdata:null,
		constructor: function(properties) {
			this.init(properties);
		},
		init: function(properties) {
			console.log('user data init');
			this.reset();
		},
		reset:function(){
			this.bagdata = [];
			this.bedroomData = {
				isshake:{used:false},
				pillow:{status:1,used:false},
				phone:{status:1,used:false},
				glim:{status:1,used:false},
				drink:{status:1,used:false},
				medicalkit:{state:0,used:false},
				plug:{status:0,used:false},
			};
			this.cookieroomData ={
				panused:false,
				boxkeyused:false,
				spannerused:false,
				pipswitchused:false,
				annihilatorused:false,
				breadused:false,
				toasterused:false,  
				dooropenused:false,
			};
			this.shakecorridordata = {
				warnpaper:false,
				halfpic:false,
			};
			this.firecorridordata ={
				wallpaper:false,
				warnbox:false,
				tel:false,
				stone:false,
			};
			this.washroomdata ={
				annihilator:false,
				towel:false,
			};
			
			this.depotdata = {
				pass:false,
				tyreonline:false,
				tyreonfloor:false,
				canused:false,
				canfull:false,
				tyreoncar:false,
			},
			this.incardata = {
				clipperused:false,
			},
			//-1 No start 0:doing -1:finished
			this.passdata = [
			[0,'chehuo',game.configdata.SCENE_NAMES.repairdepot],
			//[0,'pass01',game.configdata.SCENE_NAMES.escapebus],
			//[0,'pass01',game.configdata.SCENE_NAMES.typhoon_room],
			[-1,'planecabin',game.configdata.SCENE_NAMES.water_intopipe],
			[-1,'planeout',game.configdata.SCENE_NAMES.water_closevalue],
			[0,'typhoon',game.configdata.SCENE_NAMES.typhoon_cave],
			//[0,'pass01',game.configdata.SCENE_NAMES.typhoon_out],
			[0,'confusion',game.configdata.SCENE_NAMES.confusion_switchbox],
			
			[0,'plane',game.configdata.SCENE_NAMES.plane_board],
			
			];
			this.passdata2 = [
			[0,'chehuo',game.configdata.SCENE_NAMES.water_intopipe],
			[-1,'planecabin',game.configdata.SCENE_NAMES.water_intopipe],
			[-1,'planeout',game.configdata.SCENE_NAMES.water_closevalue],
			[-1,'typhoon',game.configdata.SCENE_NAMES.typhoon_cave],
			];
		},
		addHp:function(){
			if(this.currentHp < game.configdata.DEFAULTHEROHP){
				this.currentHp++;
			}
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



