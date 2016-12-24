game = window.game || {};


game.configdata = new function(){
	var self = this;
	// 配置信息    只读属性
	self.CANVASID = 'CANVAS_ID';
	self.NOLINE = true;
	self.BGCOLOR ='#000000';
	self.FPS = 60;
	self.RESOURCE_BASEDIR = 'img';
	
	self.MUTE = false;
	self.largePassName = {
		ecosystem:'ECOSYSTEM_LARGEPASS_NAME',
		calamity:'CALAMITY_LARGEPASS_NAME',
	},
	
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
		pass01_okend:'地震科普知识：做的很好，在地震的时候，断电保持安全',
		
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
		incar:'INCAR_SCENE',
		repairdepot:'REPAIRDEPOT_SCENE',
		escapebus:'ESCAPEBUS_SCENE',
		typhoon_cave:'TYPHOON_SCENE_CAVE',
		typhoon_room:'TYPHOON_SCENE_ROOM',
		typhoon_out:'TYPHOON_SCENE_OUT',
		confusion_switchbox:'CONFUSION_SWITCHBOX_SCENE',
		confusion_cinema:'CONFUSION_CINEMA_SCENE',
		confusion_doorway:'CONFUSION_DOORWAY_SCENE',
		plane_board:'PLANE_BOARD_SCENE',
		plane_cabin:'PLANE_CABIN_SCENE',
		plane_outside:'PLANE_OUTSIDE_SCENE',
		water_intopipe:'WATER_INTOPIPE_SCENE',
		water_closevalue:'WATER_CLOSEVALUE_SCENE',
		water_repairmachine:'WATER_REPAIRMACHINE_SCENE',
		water_clarifyingpool:'WATER_CLARIFYINGPOOL_SCENE',
		water_filterpool:'WATER_FILTERPOOL_SCENE',
		water_disinfector:'WATER_DISINFECTOR_SCENE',
		
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
	
	self.LAYOUTTYPE = {
		img:'IMAGE_TYPE',
		activeobj:'ACTIVEOBJECT_TYPE',
	},
	
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
		{name:'tyre',icon:'tyreicon',index:15},
		{name:'gasolinecan',icon:'gasolineicon',index:16},
		{name:'clipper',icon:'clippericon',index:17},
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
				rect = game.loaddata.IMAGEDATA_1[pngname];
				break;
			case 'effect': //effects
				rect = game.loaddata.IMAGEDATA_2[pngname];
				break;
			case 'action': //actions
				rect = game.loaddata.IMAGEDATA_3[pngname];
				break;
			default:
				rect = game.loaddata.IMAGEDATA_1[pngname];
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
	
	'dog.mp3',//22,  
	'knock.mp3',//23
	'fallbone.mp3',//24
	'aiyou.mp3',//25 哎呦喂
	'upjack.mp3',//压千斤顶 26
	'bee.mp3',//蜜蜂 27
	'carstart.mp3',//汽车发动 28
	'opencardoor.mp3',//开车门 29
	'grybox.mp3',//撬箱子 30
	'busrun.mp3',//开汽车 31
	'busbump.mp3',//车碰撞 32
	'openbusdoor.mp3',//气动阀门放气33
	'duanqiao.mp3',//一下敲击 34
	'water3.mp3',//水龙头35
	'dididi.mp3',//滴滴警报36
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

game.drawdata = new function(){
	var self = this;
	this.layoutType = {
		BMP_ATLAS:'LAYOUT_BITMAP_ATLAS',
		BMP_URL:'LAYOUT_BITMAP_URL',
		TXT:'LAYOUT_TEXT',
		RECT:'LAYOUT_RECT',
		ROUNDRECT:'LAYOUT_ROUND_RECT',
		CIRCLE:'LAYOUT_CIRCLE',
	};
	
	this.layoutUiWithData = function(dataArray,elementParent){
		for(var i=0;i<dataArray.length;i++){
			var item = dataArray[i];
			var elementType = item[0];
			switch(elementType){
				case this.layoutType.BMP_ATLAS:
					var atlas = game.getImg(item[1]);
					var rect = game.configdata.getPngRect(item[2],'uimap');
					var x = item[3];
					var y = item[4];
					this.drawBmoOfAtlas(atlas,rect,x,y,elementParent);
					break;
				case this.layoutType.BMP_URL:
					var imgurl = item[1];
					var x = item[2];
					var y = item[3];
					this.drawBmpOfUrl(imgurl,x,y,elementParent);
					break;
				case this.layoutType.TXT:
					var content = item[1];
					var font = item[2];
					var clr = item[3];
					var x = item[4];
					var y = item[5];
					this.drawItemTxt(content,font,clr,x,y,elementParent);
				case this.layoutType.RECT:
					var linesize = item[1];
					var lineclr = item[2];
					var fillclr = item[3];
					var x = item[4];
					var y = item[5];
					var w = item[6];
					var h = item[7];
					this.drawItemRect(linesize,lineclr,fillclr,x,y,w,h,elementParent);
					break;
				case this.layoutType.ROUNDRECT:
					var linesize = item[1];
					var lineclr = item[2];
					var fillclr = item[3];
					var x = item[4];
					var y = item[5];
					var w = item[6];
					var h = item[7];
					var cornersize = item[8];
					this.drawItemRoundrect(linesize,lineclr,fillclr,x,y,w,h,cornersize,elementParent);
					break;
				case this.layoutType.CIRCLE:
					var linesize = item[1];
					var lineclr = item[2];
					var fillclr = item[3];
					var x = item[4];
					var y = item[5];
					var r = item[6];
					this.drawItemCircle(linesize,lineclr,fillclr,x,y,r,elementParent);
					break;
			}
		}
	};
	this.drawBmoOfAtlas = function(atlas,rect,x,y,parent){
		return new Hilo.Bitmap({
			image:atlas,
			rect:rect,
			x:x,
			y:y
		}).addTo(parent);
	},
	this.drawBmpOfUrl = function(imgurl,x,y,parent){
		return new Hilo.Bitmap({
			image:imgurl,
			x:x,
			y:y
		}).addTo(parent);
	};
	this.drawItemTxt = function(txt,font,clr,x,y,parent){
		return new Hilo.Text({
			text:txt,
			font:font,
			color:clr,
			x: x,
			y: y,
		}).addTo(parent);
	};
	this.drawItemRect = function(linesize,lineclr,fillclr,x,y,w,h,parent){
		 var g1 = new Hilo.Graphics({x:x, y:y});
         g1.lineStyle(linesize,lineclr).beginFill(fillclr).drawRect(0, 0, w, h).endFill().addTo(parent);
         return g1;
	};
	this.drawItemRoundrect = function(linesize,lineclr,fillclr,x,y,w,h,r,parent){
		 var g1 = new Hilo.Graphics({x:x, y:y});
         g1.lineStyle(linesize,lineclr).beginFill(fillclr).drawRoundRect(0, 0, w, h,r).endFill().addTo(parent);
         return g1;
	};
	this.drawItemCircle = function(linesize,lineclr,fillclr,x,y,r,parent){
		var g1 = new Hilo.Graphics({x:x, y:y});
		g1.lineStyle(linesize, lineclr).beginFill(fillclr).drawCircle(0, 0, r).endFill().addTo(parent);
        return g1;
	};
};

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


