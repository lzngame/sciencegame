game = window.game || {};


game.configdata = new function(){
	var self = this;
	// 配置信息    只读属性
	self.CANVASID = 'CANVAS_ID';
	self.NOLINE = true;
	self.BGCOLOR ='#000000';
	self.FPS = 60;
	self.RESOURCE_BASEDIR = 'img';
	
	self.DOWNLOADLIST_PNGS = ['passwordbg.png','shakecorridor.jpg','hfireeffect.png','fallobjs.png','bedroomafter.png', 'plug1.png','bedroombefore.png', 'boyactions.png', 'cookieroom.png', 'corridor.png', 'corridorrbg.png', 'effects.png', 'uimap.png', 'lift.png', 'liftbg.png', 'mainbg.png'];
	//objects
	self.IMAGEDATA_1={"iconnum06":[1061,484,122,118],"lockbox":[1036,906,120,110],"question1":[1371,916,62,80],"backbtn":[607,121,80,39],"pankey":[640,884,53,26],"iconnum00":[1167,607,122,118],"warnpaper02":[1193,0,105,161],"bedroompass":[930,162,130,157],"plug2":[1290,916,76,63],"annihilator":[1313,358,64,124],"headicon2":[1192,166,104,104],"lockicon":[1290,798,95,113],"iphone":[679,349,34,22],"warn2":[855,0,65,93],"boxkeyicon":[1382,383,57,58],"block1":[1283,984,47,35],"toolsbg":[0,390,375,395],"whitenum09":[364,853,11,16],"iconnum05":[1065,162,122,118],"chuanglian":[380,637,344,242],"pan":[219,790,140,85],"ceilinglamp1":[0,173,419,212],"hand_001":[1256,343,33,51],"whitenum02":[903,98,11,16],"whitenum03":[879,939,11,16],"iconnum01":[1163,853,122,118],"whitenum07":[879,918,11,16],"pass02":[721,121,204,244],"passbtndown":[1188,523,106,78],"fanshader":[335,884,300,134],"iconnum03":[1067,285,122,118],"iconnum02":[1163,730,122,118],"whitenum05":[887,98,11,16],"iconnum09":[934,484,122,118],"tilebg":[0,884,330,123],"block0":[983,983,47,35],"plug1":[1294,606,85,115],"drinkicon":[1382,320,57,58],"boy":[729,616,165,297],"doctorhead":[899,783,132,195],"ceilingfan1":[424,173,292,171],"headbg":[468,0,257,116],"whitenum06":[364,811,11,16],"finger1":[892,983,86,36],"openbox":[730,0,120,110],"heart02":[698,884,19,17],"pillow":[1040,730,111,48],"whitenum00":[871,98,11,16],"warnpaper01":[1303,0,73,145],"chuanglian2":[380,390,344,242],"bedroomglim":[1382,446,57,36],"start01":[1384,670,56,52],"iconnum07":[1040,607,122,118],"block2":[1231,984,47,35],"doctorbg":[0,0,463,168],"emptybox":[1188,408,120,110],"question4":[1379,235,62,80],"storebtn2":[515,349,77,33],"phoneicon":[1380,487,57,58],"start02":[1384,613,56,52],"spannericon":[1194,343,57,58],"block4":[1290,730,99,63],"surebtn1":[1299,523,76,78],"corridorpass":[934,324,128,155],"whitenum04":[364,790,11,16],"quitbt":[775,963,112,40],"iconnum08":[1036,783,122,118],"liftpass":[899,616,136,162],"panspanner":[1161,976,65,40],"block3":[1194,275,99,63],"whitenum08":[364,832,11,16],"iconnum04":[1066,0,122,118],"question2":[1379,235,62,80],"question3":[1371,150,62,80],"warn1":[1301,166,65,93],"cookiepass":[930,0,131,157],"pass01":[729,370,200,241],"carkeyicon":[1381,63,57,58],"lampshader":[0,790,214,86],"btnchangeuser":[640,918,131,40],"whitenum01":[855,98,11,16],"medicalicon":[1381,0,57,58],"setup":[776,918,98,40],"bedroomdrink":[1390,798,25,62],"btn001":[468,121,134,42],"surebtn2":[1298,275,76,78],"pass01btn":[640,963,130,39],"storebtn1":[597,349,77,33],"smallstar":[692,121,21,22],"finger2":[424,349,86,36],"heart01":[692,148,19,17],"passbtnup":[1067,408,106,66],"glimicon":[1384,550,57,58]};

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
	self.StopKey = 65;// A
	self.SquatKey= 68;// D
	
	
	self.GAMETXTS ={
		note01:'地震是一种自然现象，目前人列尚不能阻止地震的发生。但是，我们可以采取有效措施，最大限度地减轻地震灾害。由于地球不断运动，逐渐积累了巨大能量，在地壳某些脆弱地带造成岩层突然发生破裂或错动，这就是地震。 地震前兆指地震发生前出现的异常现象，如地震活动、地表的明显变化以及地磁、地电、重力等地球物理异常，地下水位、水化学、动物的异常行为等。',
		
		pass01_notestart:'地震避险自救：鼠标点击走动，D 键 蹲下',
		pass01_pillow:'拿起枕头顶在头上防止掉落物砸伤',
		pass01_hide:'做的很好，迅速躲到坚固的墙体',
		pass01_squat:'按住D 键不要松手，等强震过后',
		pass01_tvflash:'地震过后，防止电器着火，拔下插座',
		pass01_okend:'做的很好，请离开房间去下一关卡',
		
		pass02_annihilator:'找到灭火器，扑灭厨房火源',
		pass02_ok:'干得不错，现在可以去走廊了',
		
		pass03_ask:'考考你，地震发生时，走楼梯，还是电梯？',
		pass03_right:'非常正确，地震发生时，要走楼梯',
		pass03_wrong:'小心点，电梯会发生坠落',
		
		pass04_warn:'你最好马上出去',
		pass04_fall:'地震时，乘坐电梯会发生坠落的危险', 
		
		pass05_runaway:'A 键减速    W键 跳跃 ,奔跑逃离险境！',
		pass05_runaway_tile:'地震中行走要小心掉落物和地上的障碍',
		pass05_fail:'地震中行走要小心掉落物和地上的障碍',
		pass05_success:'干的不错，逃离险境！',
		
		enterpass:'进 入 关 卡',
		itemdescription:'点击物品查看详情,进行操作',
		bagnote:'背包容量:5件   不可以堆叠',
		loaditem:'装备物品',
		throwitem:'丢弃物品',
		putstore:'放回仓库',
		putbag:'放入背包',
		bagIsnotenough:'背包已满',
		shopTitle:'购买装备',
		shopTxt:'金币购买',
		unlockTxt:'金币解锁技能?',
		lockReady:'解锁技能',
		lockIsReady:'技能可以解锁',
		lockOpen:'技能开启',
		lockClose:'技能锁定',
		lockSuccess:'解锁技能成功！',
		titletxt_flash:'提 示 信 息',
		titletxt_store:'仓库物品',
		notEnoughGold:'金币不足,请购买金币！',
		get:'得到:',
		touchme:'点击使者开始对话',
	};
	
	self.SCENE_NAMES ={
		cookieroom:'COOKIEROOM',
		choice:'CHOICESCNE',
		lift:'LIFESCENE_NAME',
		runaway:'RUN_AWAY_SCENE',
		attack: 'ATTACK_SCENE',
		saloon:'SALOON_SCENE',
		shakecorridor:'SHAKECORRIDOR_SCENE',
		
		load:'LOAD_SCENE_NAME',
		login:'LOGIN_SCENE_NAME',
		main:'MAIN_SCENE_NAME',
		over:'GAME_SCENE_NAME',
		shop:'SHOP_SCENE_NAME',
		
		
		story:'STORY_SCENE',
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
	
	self.EXPUPLV = [300,800,1500,3000];
	
	self.ACHIEVEMENTS = [
		{icon:'head_icon1',description:'游戏采用精密的像素动画风格'},
		{icon:'head_icon2',description:'游戏采用精密的像素动画风格'},
		{icon:'head_icon3',description:'游戏采用精密的像素动画风格'},
	];
	
	self.TOOLSICONS = [
		{name:'glim',icon:'glimicon',index:0},
		{name:'iphone',icon:'phoneicon',index:1},
		{name:'spanner',icon:'spannericon',index:2},
		{name:'drink',icon:'drinkicon',index:3},
		{name:'medialkit',icon:'medicalicon',index:4},
		{name:'boxkey',icon:'boxkeyicon',index:5},
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
	
	self.getEffectFrames = function(name){
		var atlas = new Hilo.TextureAtlas({
		image: game.getImg('uimap2'),
		width: 1024,
		height: 1024,
		frames: [
[348,688,16,16],[221,1006,16,16],[239,1006,16,16],[203,1006,16,16],[105,981,16,16],[330,688,16,16],[105,999,16,16],//coin -6
[71,981,32,32],[303,989,32,32],[490,456,32,32],[489,0,32,32],[456,460,32,32],[396,604,32,32],//brownbox -12
[330,260,64,128],[330,130,64,128],[329,718,64,128],[291,0,64,128],//hpman 13-16
[264,130,64,128],[263,727,64,128],[225,0,64,128],[203,876,64,128],//magicman 17-20
[396,66,64,128],[395,654,64,128],[264,392,64,128],[264,522,64,128],//attackman 21-24
[198,463,64,64],[198,133,64,64],[198,199,64,64],[197,810,64,64],//npcblowman 25-28
[0,524,128,128],[0,264,128,128],[0,134,128,128],[0,654,128,128],[0,394,128,128],[0,524,128,128],[0,784,128,128],//shipnpc 29-35
[264,652,64,64],[396,394,64,64],[396,328,64,64],[396,262,64,64],[396,196,64,64],//shopnpc 36-40
[198,661,64,64],[198,595,64,64],[198,529,64,64],[264,260,64,64],[198,397,64,64],[198,331,64,64],//minernpc 41-46
		],
		sprites: {
			coin: [0, 1, 2, 3,4,5,6],
			boxclose:[7],
			boxopen:[8,9,10,11,12],
			hpman:{from:13,to:16},
		}
	});
	return atlas.getSprite(name);
	}
	
	
	self.getEffectFramesOne = function(name){
		var atlas = new Hilo.TextureAtlas({
		 image: game.getImg('uimap'),
		 width: 2048,
		 height: 2048,
		 frames: [
			[1674,252,54,54],[1674,362,54,54],
		 ],
		 sprites: {
			 hand: [0, 1],
		 }
	   });
	   return atlas.getSprite(name);
	}
};
//关卡数据
game.pointdata = new function(){
	var self = this;
	self.BG_IMG_NAMES =['bgmap_02','bgmap_03','bgmap_04','bgmap_05','bgmap_06','bgmap_07','bgmap_08','bgmap_09','bgmap_12','bgmap_13','bgmap_14','bgmap_15','bgmap_17','bgmap_18','bgmap_19','bgmap_20','bgmap_23','bgmap_24','bgmap_25','bgmap_26','bgmap_31','bgmap_44','bgmap_45','bgmap_46','bgmap_49','bgmap_50','bgmap_51','bgmap_52','bgmap_53'];

	self.indexToName = function(indexlist){
		return _.map(indexlist,function(index){
			return self.BG_IMG_NAMES[index];
		});
	};
	
	
	self.pointDatas = [
		{
			index:0,
			bgs:self.indexToName([0,1,0,2,3]),
			monsternames:['训练木偶','战羊','卡普图拉','蝙蝠','狂暴'],
			monsters:[4,1000,5,20,100],
			state:[0,0,0,0,0],
			box:[1,1,1,1,0],
			coin:[4,0,3,5,0]
		},
		{
			index:1,
			bgs:self.indexToName([7,11,20,12,13]),
			monsternames:['傀儡怪','战羊','卡普图拉','蝙蝠','狂暴'],
			monsters:[19,19,2,4,100],
			state:[0,0,0,0,0],
			box:[1,1,1,1,0],
			coin:[4,4,3,5,0]
		},
	];
	
	
	self.temptxt = "这是一款勇者的游戏，深入地牢，挑战凶险。随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人";
	
	
	self.getPointData = function(index){
		return self.pointDatas[index];
	};
	
	self.door_state2pic = ['dooricon','dooricon2','dooricon3','dooricon4'];
	self.doors = [
				  {name:'初 涉 险 境',x:260,y:300,pointDataIndex:1,doorIndex:0,icon:'gate01',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'卡 普 图 拉 之 战',x:520,y:470,pointDataIndex:1,doorIndex:1,icon:'gate02',
				  description:'卡普图拉的凶顽看守，\n消灭他们！',
				  storyimg:'img/story02.png',
				  storynote:'冒险游戏游戏集中于探索未知、解决谜题等情节化和探索性的互动，强调故事线索的发掘，主要考验玩家的观察力和分析能力。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'陷 阱',x:330,y:400,pointDataIndex:1,doorIndex:2,icon:'gate03',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'半 兽 人',x:360,y:250,pointDataIndex:0,doorIndex:3,icon:'gate04',
				  description:'半兽人非常不好对付，\n凶悍的攻击，\n厚重的皮甲',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'夺 取 宝 剑',x:210,y:500,pointDataIndex:0,doorIndex:4,icon:'gate05',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'新 的 伙 伴',x:330,y:460,pointDataIndex:0,doorIndex:5,icon:'gate06',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'蛮 荒 之 地',x:1000,y:40,pointDataIndex:0,doorIndex:6,icon:'gate07',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
				  {name:'最 终 巢 穴',x:750,y:150,pointDataIndex:0,doorIndex:7,icon:'gate08',
				  description:'进入地牢的外围，\n查看情况，清除看守',
				  storyimg:'img/saleman01.png',
				  storynote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  winnote:'随着地牢的层层深入，挑战越来越大。游戏采用精密的像素动画风格，玩家要面对各种怪物，升级技能并采取不同的策略击败敌人。',
				  },
	];
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
	'bg91.mp3',   //0
	'levelup.mp3',   //1
	'winover.mp3',   //2
	'deadth.mp3',  //3
	'btn_ting.mp3', //4
	'CoinPickup.mp3', //5
	'player_hurt_male.mp3',//6
	];
	this.play = function(index,loop){
		if(loop == null)
			loop = false;
		audio = Hilo.WebSound.getAudio({
			src:'sound/'+this.sounds_url[index],
			loop:loop
		}).play();
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


