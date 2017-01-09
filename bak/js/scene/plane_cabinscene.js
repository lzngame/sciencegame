(function(ns) {
	var PlaneCabinscene = ns.PlaneCabinscene = Hilo.Class.create({
		Extends: game.BaseScene,
		name: game.configdata.SCENE_NAMES.plane_board,
		helpnote:'img/notes/plane/plane2help.png',
		
		shakeTime:320,
		isshake:true,
		shakeLevel:4,
		shakeSpeed:1,
		shakeOnce:false,
		initx:0,
		inity:0,
		atlas:null,
		
		topcover_closeimg:null,
		topcover_openimg:null,
		alarmlamp_1img:null,
		alarmlamp_2img:null,
		oxygenmaskimg_1:null,
		oxygenmaskimg_2:null,
		airjacketonfloorimg:null,
		airjacketoutimg:null,
		deskclose_img:null,
		deskopen_img:null,
		bookimg:null,
		linepipimg:null,
		
		bookobj:null,
		oxygenmaskobj:null,
		oxygenmaskobj2:null,
		airjacketobj:null,
		deskobj:null,
		safetybeltobj:null,
		
		
		initPosx:250,
		initPosy:635,
		currentOnhandObj:null,
		currentOnhandImg:null,
		
		sumtime:0,
		isflash:false,
		flashtime:0,
		ischange:false,
		sitman:null,
		constructor: function(properties) {
			PlaneCabinscene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		init: function(properties) {
			console.log('%s init', this.name);
			this.x = 0;
			this.y = 0;
			this.background = '#1A0A04';
			this.initx = this.x;
			this.inity = this.y;
		},
		active: function(passdata) {
			console.log('%s active:', this.name);
			game.sounds.play(36,true);
			this.scene = this;
			this.addTo(game.stage);
			this.alpha = 1;
			this.currentIndex = 0;
			this.blocks = [];
			this.initBlocks(this.blocks);
			this.layoutBgMap();
			this.addHero(null,this.initPosx,this.initPosy);
			
			this.hero.posx = this.initPosx;
			this.hero.posy = this.initPosy;
			this.hero.visible = false;
			
			this.shakeTime = 320;
			this.isshake = true;
			this.isflash = true;
			this.flashtime = 0;
			this.ischange = false;
			this.initTouchEvent();
			
			this.layoutUI();
			game.sounds.play(14,true);
			
			
			this.beltbg = new Hilo.Bitmap({image:'img/plane/beltbg.png',visible:false}).addTo(this);
			
			this.beltsprite = new Hilo.Sprite({
				frames:this.beltatlas.getSprite('closefail'),
				interval:10,
				//loop:false,
				visible:false,
			}).addTo(this);
			
			this.initFingerMouse();
			this.setHelp();
			
		},
		checkShowFingerObjects:function(mouseX,mouseY){
			if(
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.deskobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.bookobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.oxygenmaskobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.airjacketobj)||
				this.checkActiveItemWithoutPos(mouseX,mouseY,this.safetybeltobj)
			){
				return true;
			}else{
				return false;
			}
		},
		receiveMsg: function(msg) {
			
		},
		checkActiveObjects:function(mouseX,mouseY){
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.deskobj)){
				this.sitman.currentFrame = 0;
				this.sitman._frames = this.atlas.getSprite('closedesk');
				this.sitman.loop = false;
				this.sitman.play();
				this.deskobj.status = 2;
				this.bookobj.state  = 2;
				var scene = this;
				new Hilo.Tween.to(this,{alpha:1},{
					duration:100,
					delay:500,
					onComplete:function(){
						scene.deskclose_img.visible = true;
						scene.deskopen_img.visible = false;
					}
				});
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.bookobj)){
				if(this.bookobj.state == 0){
					this.sayNo();
					return true;
				}
				this.bookimg.removeFromParent();
				this.sitman.currentFrame = 0;
				this.sitman._frames = this.atlas.getSprite('takebook');
				this.sitman.loop = false;
				this.sitman.play();
				this.bookobj.status = 2;
				this.oxygenmaskobj.state = 1;
				return true;
			}
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.oxygenmaskobj)){
				if(this.oxygenmaskobj.state == 0){
					this.sayNo();
					return true;
				}
				if(this.oxygenmaskobj.state == 1){
					this.sitman.currentFrame = 0;
					this.sitman._frames = this.atlas.getSprite('takeoxygen');
					this.sitman.loop = false;
					this.sitman.play();
					this.oxygenmaskobj.y += 100;
					this.oxygenmaskobj.state = 2;
					var scene = this;
					new Hilo.Tween.to(this,{alpha:1},{
						duration:100,
						delay:500,
						onComplete:function(){
							scene.oxygenmaskimg_2.visible = true;
							scene.oxygenmaskimg_1.visible = false;
						}
					});
					return true;
				}
				if(this.oxygenmaskobj.state == 2){
					this.sitman.currentFrame = 0;
					this.sitman._frames = this.atlas.getSprite('onoxygen');
					this.sitman.loop = false;
					this.sitman.play();
					this.oxygenmaskimg_2.visible = false;
					this.linepipimg.visible = true;
					this.oxygenmaskobj.status = 2;
					this.airjacketobj.state = 1;
					return true;
				}
			}
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.airjacketobj)){
				if(this.airjacketobj.state == 0){
					this.sayNo();
					return true;
				}
				if(this.airjacketobj.state == 1){
					this.airjacketonfloorimg.visible = false;
					this.airjacketoutimg.visible = true;
					this.airjacketobj.x -= 50;
					this.airjacketobj.state = 2;
					return true;
				}
				if(this.airjacketobj.state == 2){
					this.airjacketonfloorimg.visible = false;
					this.airjacketoutimg.visible = false;
					this.airjacketobj.status = 2;
					this.airjacketonbodyimg.visible = true;
					this.safetybeltobj.state = 2;
					this.safetybeltobj.status = 1;
					this.passoverReady('img/nextpasspoint.png',2000,game.configdata.SCENE_NAMES.plane_outside);
					
					/*new Hilo.Tween.to(this,{alpha:1},{
						duration:1100,
						delay:3500,
						onComplete:function(){
							game.switchScene(game.configdata.SCENE_NAMES.plane_outside);
						}
					});*/
					return true;
				}
			}
			
			
			if(this.checkActiveItemWithoutPos(mouseX,mouseY,this.safetybeltobj)){
				if(this.safetybeltobj.state == 0){
					this.sayNo();
					return true;
				}
				this.beltbg.visible = true;
				this.beltsprite.visible = true;
				this.beltsprite.loop = false;
				this.beltsprite.currentFrame = 0;
				this.beltsprite._frames = this.beltatlas.getSprite('closeok');
				this.safetybeltobj.status = 2;
				
				return true;
			}
			return false;
		},
		
		
		createActiveObj:function(objname,x,y,targetx,targety,readyImgurl,finishedImgurl,clickrect,status){
			return new game.ActiveObject({
				name:objname,
				x:x,
				y:y,
				targetx:targetx,
				targety:targety,
				readyImgUrl:readyImgurl,
				finishedImgUrl:finishedImgurl,
				clickArea:clickrect,
				status:status,
			}).addTo(this);
		},
		
		layoutBgMap:function(){
			var scene = this;
			
			new Hilo.Bitmap({
				image:'img/plane/cabinbg.png',
			}).addTo(this);
			
			this.linepipimg = new Hilo.Bitmap({image:'img/plane/linepip.png',x:555,y:77,visible:false}).addTo(this);
			
			this.oxygenmaskimg_1 = new Hilo.Bitmap({image:'img/plane/oxygenmask1.png',x:535,y:87,visible:false}).addTo(this);
			this.oxygenmaskimg_2 = new Hilo.Bitmap({image:'img/plane/oxygenmask2.png',x:535,y:77,visible:false}).addTo(this);
			
			this.alarmlamp_1img = new Hilo.Bitmap({image:'img/plane/alarmlamp1.png',x:33,y:147}).addTo(this);
			this.alarmlamp_2img = new Hilo.Bitmap({image:'img/plane/alarmlamp.png',x:33,y:147}).addTo(this);
			this.topcover_closeimg = new Hilo.Bitmap({image:'img/plane/closetopcover.png',x:446,y:56}).addTo(this);
			this.topcover_openimg = new Hilo.Bitmap({image:'img/plane/opentopcover.png',x:446,y:56,visible:false}).addTo(this);
			this.airjacketonfloorimg = new Hilo.Bitmap({image:'img/plane/airjacket.png',x:583,y:560}).addTo(this);
			this.airjacketoutimg = new Hilo.Bitmap({image:'img/plane/outairjacket.png',x:523,y:520,visible:false}).addTo(this);
			this.deskopen_img = new Hilo.Bitmap({image:'img/plane/desk22.png',x:516,y:420}).addTo(this);
			this.bookimg = new Hilo.Bitmap({image:'img/plane/book.png',x:510,y:420}).addTo(this);
			this.deskclose_img = new Hilo.Bitmap({image:'img/plane/desk11.png',x:516,y:380,visible:false}).addTo(this);
			

			this.atlas = new Hilo.TextureAtlas({
                image:'img/plane/cabinatlas.png',
                width: 1060,
                height:1248,
                frames:[[424, 0, 210, 310], [848, 0, 210, 310], [636, 936, 210, 310], [636, 624, 210, 310], [636, 624, 210, 310], [636, 312, 210, 310], [636, 0, 210, 310], [424, 936, 210, 310], [424, 624, 210, 310], [424, 312, 210, 310], [848, 312, 210, 310], [212, 936, 210, 310], [212, 624, 210, 310], [212, 312, 210, 310], [212, 0, 210, 310], [212, 624, 210, 310], [212, 936, 210, 310], [848, 312, 210, 310], [0, 936, 210, 310], [0, 624, 210, 310], [0, 624, 210, 310], [0, 312, 210, 310], [0, 0, 210, 310]],
                sprites: {
                	idle:[11],
                	closedesk:[11,12,13,14,15,16],
                	takeoxygen:[17,18,19,20,21,22],
                	takebook:[6,7,8,9,10],
                	onoxygen:[0,1,2,3,4,5],
                }
            });
            this.beltatlas = new Hilo.TextureAtlas({
                image:'img/plane/beltatlas.png',
                width: 2408,
                height:2752,
				frames:[[0, 0, 1202, 686], [0, 2064, 1202, 686], [1204, 1376, 1202, 686], [0, 2064, 1202, 686], [1204, 1376, 1202, 686], [1204, 688, 1202, 686], [1204, 0, 1202, 686], [1204, 2064, 1202, 686], [0, 1376, 1202, 686], [0, 688, 1202, 686]],
                sprites: {
                	closefail:[0,0,0,0,1,2,3,4,0,1,2,3,4,0,1,2,3,4,5],
                	closeok:[5,6,7,8,9],
                	step1:[6,6],
                	step2:[6,7,8]
                }
            });
            
           this.sitman = new Hilo.Sprite({
				frames:this.atlas.getSprite('idle'),
				interval:10,
				x:640-130,
				y:376-94-10,
			}).addTo(this);
			
			this.airjacketonbodyimg = new Hilo.Bitmap({image:'img/plane/airjacketonbody.png',x:604,y:410-24,visible:false}).addTo(this);
			
			this.beltimg1 = new Hilo.Bitmap({image:'img/plane/belt1.png',x:692,y:470}).addTo(this);
			this.beltimg2 = new Hilo.Bitmap({image:'img/plane/belt2.png',x:655,y:445,visible:false}).addTo(this);
			new Hilo.Bitmap({image:'img/plane/handrail.png',x:613,y:454}).addTo(this);
			
            
			this.bookobj =    this.createActiveObj('bookobj',511,428,224,342,'empty','empty',[0,0,25,45],1);
			this.deskobj =    this.createActiveObj('deskobj',522,425,0,342,'empty','empty',[0,0,60,20],1);
			this.oxygenmaskobj  =    this.createActiveObj('oxygenobj',562,263,0,342,'empty','empty',[0,0,50,50],1);
			//this.oxygenmaskobj2  =    this.createActiveObj('oxygenobj',562,363,0,342,'empty','empty',[0,0,50,50],1);
			this.airjacketobj  =    this.createActiveObj('airjacket',577,542,0,342,'empty','empty',[0,0,40,40],1);
			this.safetybeltobj  =    this.createActiveObj('safetybeltobj',683,477,0,342,'empty','empty',[0,0,65,45],1);
		},
		
		herowalk:function(targetx,targety){
			
		},
		sayNo:function(){
			game.headPanel.sayNo();
		},
		shakeScene:function(){
			if(this.shakeTime > 0 && this.isshake){
				
				this.x = this.initx;
				this.y = this.inity;
				var offsetx = Math.random()*this.shakeLevel;
				var offsety = Math.random()*this.shakeLevel;
				var d1 = Math.random();
				var d2 = Math.random();
				if(d1 > 0.5)
				  this.x += offsetx;
				else
				  this.x -= offsetx;
				if(d2 > 0.5)
				  this.y += offsety;
				else
				  this.y -= offsety;
				this.shakeTime -= 2;
			}else if(this.isshake){
				game.sounds.stop(36);
				this.shakeTime = 0;
				this.isshake = false;
				this.x = this.initx;
				this.y = this.inity;
				this.topcover_closeimg.visible = false;
				this.topcover_openimg.visible = true;
				this.oxygenmaskimg_1.visible = true;
			}
		},
		
		onUpdate:function(){
			if(this.isflash){
				this.flashtime ++;
				if(this.flashtime > 10){
					this.flashtime = 0;
					this.ischange = !this.ischange;
				}
				if(this.ischange){
					this.alarmlamp_1img.visible = true;
					this.alarmlamp_2img.visible = false;
				}else{
					this.alarmlamp_1img.visible = false;
					this.alarmlamp_2img.visible = true;
				}
			}
			this.shakeScene();
		},
	});
})(window.game);