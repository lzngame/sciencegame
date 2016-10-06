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
		var img = game.getImg('boyactions');
		self.soliderhero_atlas = new Hilo.TextureAtlas({
				image: img,
				width: 2048,
				height: 2048,
				frames: [
					[220, 948, 220, 343],
					[315, 0, 220, 343],
					[0, 1291, 220, 343],
					[0, 1634, 220, 343],
					[0, 948, 220, 343],
					[660, 686, 220, 343], //walk 0-5
					
					[220, 1291, 220, 343],  //squat 6
					
					[660, 1029, 220, 343],  
					[220, 1634, 220, 343],  //idle 7-8
					
					[1195, 343, 220, 343],//jump 9
					
					[1320, 686, 220, 343], //arm 10
					
					[1195, 0, 220, 343],//arm up 11
					
					[975, 0, 220, 343],
					[880, 1372, 220, 343],
					[880, 1029, 220, 343],
					[880, 686, 220, 343],
					[880, 1372, 220, 343],
					[755, 343, 220, 343], //pillow up  12-17
					
					[535, 343, 220, 343], //annihilator 18
					
					[1320, 1029, 220, 343],
					[535, 0, 220, 343],
					[440, 1372, 220, 343],
					[1320, 1029, 220, 343],
					[440, 1029, 220, 343],
					[440, 686, 220, 343], //run  19-24
					
					[1100, 1372, 220, 343], //runstop  25
					
					[975, 343, 220, 343],  //pillowsquat 26
					
					[0, 474, 315,237],
					[0, 0, 315,237],
					[0, 237, 315,237],
					[0, 711, 315,237],    //crawl   27-30
				],
				sprites: {
					walk:[0,1,2,3,4,5],
					idle: [7,7,8,8],
					squat:[6,6],
					pick:[6,6],
					jump:[9,9],
					handon:[10,10],
					handup:[11,11],
					pillowup:{from:12,to:17},
					
					annihilator:[18,18],
					run:[19,20,21,22,23,24],
					runstop:[25,25],
					fallhit:[25,25],
					pillowsquat:[26,26],
					crawl:[27,28,29,30],
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
			//-1 No start 0:doing -1:finished
			this.passdata = [
			[0,'pass01',game.configdata.SCENE_NAMES.attack],
			[-1,'pass02',game.configdata.SCENE_NAMES.firecorridor],
			[-1,'pass03',game.configdata.SCENE_NAMES.depot],
			[-1,'pass04',''],
			[-1,'pass05',''],
			[-1,'pass06',''],
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



