game = window.game || {};


game.configdata = new function(){
	var self = this;
	// 配置信息    只读属性
	self.CANVASID = 'CANVAS_ID';
	self.NOLINE = false;
	self.BGCOLOR ='#000000';
	self.FPS = 60;
	self.RESOURCE_BASEDIR = 'img';
	
	self.MUTE = false;
	
	//loading images
	self.DOWNLOADLIST_PNGS = ['bedroomafter.png', 'bedroombefore.png', 'boyactions.png', 'breakbridge.png', 'carglass.png', 'carmeter.png', 'carsafetybelt.png', 'circlebridge.png', 'cookieroom.png', 'corridor.png', 'corridorrbg.png', 'depot.png', 'drawer.png', 'effect2.png', 'effects.png', 'fallobjs.png', 'firecorridor.jpg', 'fireglassbg.png', 'gameover.png', 'gasolinecar.png', 'hfireeffect.png', 'interlude.png', 'mainbg.png', 'passwordbg.png', 'right.png', 'saloon.png', 'shakecorridor.jpg', 'telbg.png', 'uimap.png', 'washroombg.png', 'waterbasin.jpg', 'wwboyactions.png'];
	//objects
	self.IMAGEDATA_1 = {"telnum02":[913,507,19,29],"pass04":[770,788,159,191],"flower":[1326,694,80,232],"ragicon":[1420,218,57,58],"lockbox":[1092,706,120,110],"halfpic01":[1211,277,108,149],"wallpaper02":[600,246,170,339],"backbtn":[1092,821,117,50],"tel1":[1492,137,51,32],"pankey":[559,992,53,26],"holepic":[1324,299,87,103],"tel6":[786,984,51,32],"overhalfpic":[1405,931,74,86],"right":[704,892,60,60],"tel8":[1200,987,51,32],"pass05":[937,193,145,179],"btnchangeuser":[794,193,131,40],"plug2":[1324,0,76,63],"annihilator":[1414,407,64,124],"headicon2":[1217,694,104,104],"iphone":[617,992,34,22],"boxkeyicon":[1489,662,57,58],"telnum06":[913,439,19,29],"telnum09":[913,473,19,29],"towelicon":[1429,599,57,58],"toolsbg":[0,173,375,395],"whitenum09":[1018,162,11,16],"nextpass":[468,124,103,43],"ragonfloor":[1482,272,57,58],"pan":[559,902,140,85],"telnum03":[1160,115,19,29],"telnum00":[1037,979,19,29],"tel7":[842,984,51,32],"hand_001":[297,840,33,51],"whitenum02":[1034,162,11,16],"whitenum03":[736,957,11,16],"firelamp2":[563,519,28,41],"whitenum07":[752,957,11,16],"toaster":[1430,146,57,58],"tel5":[1491,618,51,32],"breadicon":[1482,335,57,58],"pass02":[934,788,153,186],"passbtndown":[1092,876,106,78],"tel4":[1324,68,51,32],"fanshader":[0,701,300,134],"prepass":[1092,959,103,43],"pipe":[380,530,96,30],"whitenum05":[954,162,11,16],"breadonfloor":[1492,174,40,30],"pass03":[775,246,157,188],"tilebg":[0,573,330,123],"telnum08":[898,984,19,29],"firewarnbtn":[1544,247,36,60],"plug1":[1324,407,85,115],"headok01":[1215,0,104,104],"drinkicon":[1484,910,57,58],"boy":[600,590,165,297],"telnum04":[1061,979,19,29],"doctorhead":[939,544,132,195],"halfpic02":[1211,431,108,149],"headfail0":[1320,585,104,104],"ceilingfan1":[0,840,292,171],"headbg":[297,902,257,116],"wallpaper01":[335,573,260,324],"whitenum06":[704,957,11,16],"openbox":[1087,162,120,110],"heart02":[656,992,19,17],"pillow":[468,0,111,48],"whitenum00":[1002,162,11,16],"headfail2":[1320,585,104,104],"warnpaper01":[1411,694,73,145],"suo":[1544,174,45,68],"tel9":[1256,987,51,32],"doorcard":[380,422,178,103],"bedroomglim":[1212,224,57,36],"start01":[1324,527,56,52],"tryagain":[1087,277,117,50],"tel0":[1492,100,51,32],"surebtn2":[1324,931,76,78],"doctorbg":[0,0,463,168],"emptybox":[1090,0,120,110],"storebtn2":[704,984,77,33],"phoneicon":[1482,209,57,58],"start02":[1491,524,56,52],"firelamp1":[563,473,28,41],"spannericon":[1429,536,57,58],"tel3":[1492,63,51,32],"surebtn1":[1405,0,76,78],"corridorpass":[1078,377,128,155],"carkey":[563,453,28,15],"headfail3":[1321,109,104,104],"whitenum04":[720,957,11,16],"quitbt":[1087,332,112,40],"pass06":[770,590,164,193],"warnpaper02":[1214,821,105,161],"liftpass":[937,377,136,162],"telnum05":[1184,115,19,29],"crawlbtn":[775,439,133,134],"panspanner":[1090,115,65,40],"whitenum08":[970,162,11,16],"telenter":[1489,788,51,32],"killfireicon":[1487,844,57,58],"cookiepass":[954,0,131,157],"telnum07":[305,795,19,29],"pass01":[794,0,155,188],"carkeyicon":[1489,725,57,58],"towel":[1416,299,61,89],"elbow":[1411,844,71,61],"smallplug":[563,422,28,26],"whitenum01":[986,162,11,16],"stoneicon":[1542,973,50,45],"setup":[934,979,98,40],"bedroompass":[1076,544,130,157],"tel2":[1491,581,51,32],"bedroomdrink":[305,701,25,62],"largepass02":[380,173,204,244],"telnum01":[913,541,19,29],"pass01btn":[939,744,130,39],"largepass01":[589,0,200,241],"storebtn1":[481,530,77,33],"halfpic01icon":[1483,398,57,58],"smallstar":[305,768,21,22],"doorcardicon":[1484,973,53,45],"shader":[1430,83,57,58],"heart01":[680,992,19,17],"halfpic02icon":[1483,461,57,58],"lockpanelexit":[1324,218,91,76],"passbtnup":[468,53,106,66],"headfail1":[1212,115,104,104],"glimicon":[1486,0,57,58],"headok02":[1211,585,104,104]};

	//effects
	self.IMAGEDATA_2={"smog03":[526,384,110,105],"starteffect08":[234,278,146,139],"smog01":[526,174,110,105],"smog08":[526,69,110,105],"starteffect12":[234,834,146,139],"starteffect13":[380,0,146,139],"starteffect11":[234,695,146,139],"starteffect07":[234,417,146,139],"starteffect04":[234,556,146,139],"annihilatoreffect06":[0,320,234,160],"annihilatoreffect02":[0,800,234,160],"annihilatoreffect03":[0,640,234,160],"shandian_00002":[636,316,84,71],"annihilatoreffect01":[0,0,234,160],"fire4":[526,0,128,69],"starteffect09":[380,695,146,139],"smog02":[526,279,110,105],"smog07":[636,69,110,105],"smog05":[526,594,110,105],"smog04":[526,489,110,105],"extinguish1":[507,972,127,52],"starteffect10":[380,556,146,139],"extinguish3":[0,960,127,52],"starteffect05":[234,0,146,139],"annihilatoreffect04":[0,480,234,160],"starteffect06":[234,139,146,139],"shandian_00004":[636,387,84,71],"shandian_00005":[636,245,84,71],"shandian_00006":[636,529,84,71],"shandian_00001":[636,174,84,71],"smog06":[526,699,110,105],"xiaodianhua_00005":[127,960,64,64],"starteffect01":[380,417,146,139],"starteffect02":[380,278,146,139],"extinguish4":[380,972,127,52],"shandian_00003":[636,458,84,71],"fire3":[508,834,128,69],"fire1":[380,834,128,69],"xiaodianhua_00001":[636,664,64,64],"xiaodianhua_00006":[636,600,64,64],"extinguish2":[634,972,127,52],"annihilatoreffect05":[0,160,234,160],"fire2":[380,903,128,69],"starteffect03":[380,139,146,139],"fire5":[508,903,128,69]};
	//actions
	self.IMAGEDATA_3={"handupidle":[1568,310,217,310],"run2":[651,620,217,310],"handonidle":[1568,0,217,310],"run5":[917,0,217,310],"crawl2":[0,322,266,161],"crawl1":[0,161,266,161],"walk5":[1134,0,217,310],"walk_handup6":[483,0,217,310],"walk_handup1":[266,310,217,310],"walk1":[1351,310,217,310],"jump":[1736,620,217,310],"squat":[1785,0,217,310],"run3":[483,310,217,310],"walk_handup3":[434,620,217,310],"crawl4":[0,483,266,161],"idle2":[868,620,217,310],"walk_handup4":[217,644,217,310],"walk_handup2":[266,0,217,310],"run1":[700,0,217,310],"annihilator":[1519,620,217,310],"walk6":[1085,620,217,310],"walk4":[1134,310,217,310],"stoprun":[1785,310,217,310],"run6":[917,310,217,310],"run4":[700,0,217,310],"idle1":[700,310,217,310],"crawl3":[0,0,266,161],"walk_handup5":[0,644,217,310],"walk3":[1302,620,217,310],"walk2":[1351,0,217,310]};


	self.MAXSIZE = {maxWidth:1202,maxHeight:686};
	self.GAME_COLORS = {
		btntxtclr:'#FED28B'
	};
	self.STORESIZE = 15;
	
	self.DEFAULTHEROHP = 4;
	
	self.JumpKey = 87;// W
	self.StopKey = 65;// A 65  S83 D68
	self.SquatKey= 83;// S
	
	
	self.GAMETXTS ={
		note01:'地震是一种自然现象，目前人列尚不能阻止地震的发生。但是，我们可以采取有效措施，最大限度地减轻地震灾害。由于地球不断运动，逐渐积累了巨大能量，在地壳某些脆弱地带造成岩层突然发生破裂或错动，这就是地震。 地震前兆指地震发生前出现的异常现象，如地震活动、地表的明显变化以及地磁、地电、重力等地球物理异常，地下水位、水化学、动物的异常行为等。',
		
		pass01_notestart:'地震避险自救：鼠标点击走动，D 键 蹲下',
		pass01_pillow:'拿起枕头顶在头上防止掉落物砸伤',
		pass01_hide:'做的很好，迅速躲到坚固的墙体',
		pass01_squat:'按住D 键不要松手，等强震过后',
		pass01_tvflash:'地震过后，防止电器着火，拔下插座',
		pass01_okend:'做的很好，断电保持安全',
		
		pass02_annihilator:'找到灭火器，扑灭厨房火源',
		pass02_ok:'干得不错',
		
		pass03_ask:'考考你，地震发生时，走楼梯，还是电梯？',
		pass03_right:'非常正确，地震发生时，要走楼梯',
		pass03_wrong:'小心点，电梯会发生坠落',
		
		pass04_warn:'你最好马上出去',
		pass04_fall:'地震时，乘坐电梯会发生坠落的危险', 
		
		pass05_runaway:'A 键减速    W键 跳跃 ,奔跑逃离险境！',
		pass05_runaway_tile:'地震中行走要小心掉落物和地上的障碍',
		pass05_fail:'地震中行走要小心掉落物和地上的障碍',
		pass05_success:'干的不错，逃离险境！',
		
		
	};
	
	self.SCENE_NAMES ={
		cookieroom:'COOKIEROOM',
		passchoice:'PASSCHOICE_SCENE',
		attack: 'ATTACK_SCENE',
		saloon:'SALOON_SCENE',
		shakecorridor:'SHAKECORRIDOR_SCENE',
		firecorridor:'FIRECORRIDOR_SCENE',
		washroom:'WASHROOM_SCENE',
		fireglass:'FIREGLASS_SCENE',
		gameover:'GAMEOVER_SCENE',
		depot:'DEPOT_SCENE',
		
		load:'LOAD_SCENE_NAME',
		login:'LOGIN_SCENE_NAME',
		main:'MAIN_SCENE_NAME',
		over:'GAME_SCENE_NAME',
		shop:'SHOP_SCENE_NAME',
		
		
		
		map:'MAP_SCENE',
		stash:'STASH_SCENE',
		failure:'FAILURE_SCENE',
		win:'WIN_SCENE',
		unlock:'UNLOCK_SCENE',
		coach:'COACH_SCENE',
		point:'POINT_SCENE',
		
	};
	
	self.MSAGE_TYPE ={
		idle:'IDLE',
		attack:'ATTACK',
		shield:'SHIELD',
		behit:'BEHIT',
		dead:'DEAD',
		monsterdead:'MONSTERDEAD',
		herodead:'HERODEAD',
		shieldfinish:'SHIELDFINISH',
		herobehit:'HEROBEHIT',
		changeHerohp:'CHANGEHEROHP',
		winpoint:'WINPOINT',
		useItem:'USEITEM',
		monseterLostHp:'MONSTERLOSTHP',	
		herojump:'HEROJUMP',
		herosquat:'HEROSQUAT',
		herosquat2idle:'HEROSQUAT2IDLE',
		herorunstop:'HERORUNSTOP',
		runstop2run:'HERORUNSTOP2RUN'
	},
	
	
	self.TOOLSICONS = [
		{name:'glim',icon:'glimicon',index:0},
		{name:'iphone',icon:'phoneicon',index:1},
		{name:'spanner',icon:'spannericon',index:2},
		{name:'drink',icon:'drinkicon',index:3},
		{name:'medialkit',icon:'medicalicon',index:4},
		{name:'boxkey',icon:'boxkeyicon',index:5},
		{name:'stone',icon:'stoneicon',index:6},
		{name:'doorcard',icon:'doorcardicon',index:7},
		{name:'annihilator',icon:'killfireicon',index:8},
		{name:'carkey',icon:'carkeyicon',index:9},
		{name:'towel',icon:'towelicon',index:10},
		{name:'halfpic01',icon:'halfpic02icon',index:11},
		{name:'halfpic02',icon:'halfpic01icon',index:12},
		{name:'bread',icon:'breadicon',index:13},
		{name:'rag',icon:'ragicon',index:14},
		
	];

	self.mainStageSize ={width:320,height:480};
	//最大携带药剂数量
	self.maxPotion = 5;
	
	//装备动画时间
	self.changItemTime = 500;
	
	self.getObjectSize = function(pngname){
		var rect = self.IMAGEDATA_3[pngname];
		if(rect == null){
			console.log('Error 1:-------------------------------- %s is not exist',pngname);
			return [0,0,0,0];
		}else{
			return rect;
		}
	}
	
	self.getPngRect = function(pngname,sourcePng){
		var rect = null;
		switch(sourcePng){
			case 'uimap':  //objects
				rect = self.IMAGEDATA_1[pngname];
				break;
			case 'effect': //effects
				rect = self.IMAGEDATA_2[pngname];
				break;
			case 'action': //actions
				rect = self.IMAGEDATA_3[pngname];
				break;
			default:
				rect = self.IMAGEDATA_1[pngname];
				break;
		}
		if(rect == null){
			console.log('Error 1:-------------------------------- %s is not exist',pngname);
			return [0,0,0,0];
		}else{
			return rect;
		}
	}
	
	self.getPngSize = function(pngname){
		var rect = self.IMAGEDATA_1[pngname];
		if(rect == null){
			console.log('Error 1:-------------------------------- %s is not exist',pngname);
			return [0,0,0,0];
		}else{
			return rect;
		}
	}
	
	self.getPngSize2 = function(pngname){
		if(self.IMAGEDATA_2[pngname] == null){
			console.log('Error 2: -------------------------------- %s is not exist',pngname);
			return [0,0,0,0];
		}else{
			var initrect = self.IMAGEDATA_2[pngname];
			return _.map(initrect,function(item){return item;});
		}
	}
	
	self.getRectList = function(names){
		var list = _.map(names,function(item){
			return self.getPngSize();
		});
		return list;
	}
	
	self.getList = function(names){
		var list = [];
		for(var i=0;i<names.length;i++){
			rect = self.getPngSize2(names[i]);
			list.push(rect);
		}
	}
	
	
};


game.userData = new function(){
	var self = this;
	
	this.heroData = null;
	this.coachData = null;
	
	this.saveHeroDataJsonSt = function(){
		var st = JSON.stringify(this.heroData);
		console.log(st);
		localStorage.heroData = st;
		console.log(st2);
	};
	this.initData = function(){
		console.log('userData.init');
		this.coachData = new game.HeroData();
		if(localStorage.heroData){
			var st = localStorage.heroData;
			var obj = JSON.parse(st);
			console.log(obj);
			this.heroData = obj;
		}else{
			this.heroData =  new game.HeroData();
		}
		if(localStorage.userInfo){
			var obj = JSON.parse(st);
			console.log(obj);
		}else{
		}
		//this.saveHeroDataJsonSt();
	};
	this.clear = function(){
		localStorage.clear();
	};
	this.initData();
};

game.sounds = new function(){
	var self = this;
	this.sounds_url =[
	'bg01.mp3',   //0
	'di01.mp3',   //1
	'di02.mp3',   //2
	'deadth.mp3',  //3
	'firewarn.mp3', //4
	'turn.mp3', //5
	'uplv.mp3',//6
	'opendoor.mp3',//7
	'warn01.mp3',//8
	'fail.mp3',//9
	'break.mp3',//10
	'laugh.mp3',//11
	'ting.mp3',//12
	'shake.mp3',//13
	'music_logo.mp3',//14
	'verygood.mp3',//15
	'elec.mp3',//16
	'annihilator.mp3',//17
	'sayno.mp3',//18
	'ting.mp3',//19
	'passbg.mp3',//20
	'dang.mp3',//21
	];
	this.play = function(index,loop){
		if(game.configdata.MUTE)
			return;
		if(loop == null)
			loop = false;
		audio = Hilo.WebSound.getAudio({
			src:'sound/'+this.sounds_url[index],
			loop:loop
		}).play();
	};
	this.stop = function(index){
		var src = 'sound/'+this.sounds_url[index];
		Hilo.WebSound.removeAudio(src);
	};
};

game.clock = new function(){
	var self = this;
	self.fpstick = 0;
	self.lasttime = 0;
	self.systemtime = 0;
	self.framecount = 0;
	
	self.tick = function(){
		var now =+ new Date;
		self.fpstick = now - self.lasttime;
		self.framecount++;
		self.systemtime += self.fpstick;
		self.lasttime = now;
	};
	self.getSystemtime = function(){
		return self.systemtime;
	};
	self.getFrame = function(){
		return self.framecount;
	};
}

function layoutImgs(arrayList,img,parent){
	var re = [];
	for(var i=0;i<arrayList.length;i++){
		var item = arrayList[i];
		var bmp = new Hilo.Bitmap({
			image:img,
			rect:game.configdata.getPngSize(item.rect),
			x:item.x,
			y:item.y,
		}).addTo(parent);
		re.push(bmp);
	}
	return re;
}

function createImg(name,position,parentWidth,parentHeight){
	var rect = game.configdata.getPngSize(name);
	var bmp = new Hilo.Bitmap({
		image:img,
		rect:rect,
	});
	if(position == 'center'){
		bmp.x = parentWidth/2 - rect[2]/2,
		bmp.y = parentHeight/2 - rect[3]/2;
	}
	return bmp;
}

function setCenter(viewojb){
	var parent = viewojb.parent;
	viewojb.x = parent.width/2 - viewojb.width/2;
	viewojb.y = parent.height/2 - viewojb.height/2;
}

function addDecorativeSide(img,center) {
	var left = new Hilo.Bitmap({
		image: img,
		rect: game.configdata.getPngSize('bgleft'),
	}).addTo(center);
	var right = new Hilo.Bitmap({
		image: img,
		rect: game.configdata.getPngSize('bgleft'),
	}).addTo(center);
	left.width = right.width = game.configdata.sidewidth;
	left.x =  -game.configdata.sidewidth;
	right.x = center.width;
	left.y = right.y = 0;
	right.height = left.height = center.height;
}

function addfps(x,y,parent){
	var fps = new game.FpsPanel({x:x,y:y});
	parent.addChild(fps);
}

function setLeft(viewojb){
	var parent = viewojb.parent;
	viewojb.x = parent.width/2 - viewojb.width/2;
	viewojb.y = parent.height/2 - viewojb.height/2;
}


