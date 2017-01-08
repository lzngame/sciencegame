(function(ns) {
	var BaseScene = ns.BaseScene = Hilo.Class.create({
		Extends: Hilo.Container,
		name:'',
		hero:null,
		bgImg:null,
		fingerMouse:null,
		blocks:null,
		ignoreTouch:false,
		helpnote:'img/notes/defaultnote.png',
		constructor: function(properties) {
			BaseScene.superclass.constructor.call(this, properties);
			this.init(properties);
		},
		
		initFingerMouse:function(){
			this.fingerMouse = new game.FingerMouse({
				visible:false,
			}).addTo(this);
			
		},
		initkeyevent:function(){
			var scene = this;
			document.onkeydown=function(event){
             var e = event || window.event || arguments.callee.caller.arguments[0];
             if(e && e.keyCode===game.configdata.JumpKey){ 
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herojump});
                }
              if(e && e.keyCode===game.configdata.SquatKey){ 
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herosquat});
                }            
         	}; 
         	document.onkeyup=function(event){
             var e = event || window.event || arguments.callee.caller.arguments[0];
             if(e && e.keyCode===game.configdata.JumpKey){ 
                  //要做的事情
 					console.log('Jum');
                }
              if(e && e.keyCode==game.configdata.SquatKey){ 
                  //要做的事情
 					console.log('squat to idle');
 					scene.receiveMsg({msgtype:game.configdata.MSAGE_TYPE.herosquat2idle});
                }            
         	}; 
		},
		showDialog:function(noteurl){
			game.drdialog.showTxt(noteurl);
			game.drdialog.x = 180;
			game.drdialog.y = 150;
			this.ignoreTouch = true;
			var scene = this;
			game.drdialog.on(Hilo.event.POINTER_START,function(e){
				game.drdialog.hide(function(){
					scene.ignoreTouch = false;
				});
			});
		},
		showPassover:function(noteurl,next,data){
			game.drdialog.x = 0;
			game.drdialog.y = 0;
			game.drdialog.showPassover(noteurl);
			this.ignoreTouch = true;
			var scene = this;
			game.drdialog.on(Hilo.event.POINTER_START,function(e){
				game.drdialog.hide(function(){
					scene.ignoreTouch = false;
					game.switchScene(next,data);
				});
			});
		},
		passoverReady:function(noteurl,delaytime,next,data){
			var scene = this;
			new Hilo.Tween.to(this,{alpha:1},{delay:delaytime,duration:100,onComplete:function(){
					scene.showPassover(noteurl,next,data);
				}});
		},
		addHero:function(x,y,dir){
			this.hero = new game.Hero({
				name: 'Hero',
				framename: 'idle',
				posx: x,
				posy: y,
				atlas:game.monsterdata.soliderhero_atlas,
				once: false,
				interval: 10,
				alpha:1,
			}).addTo(this);
			if(dir == 'left'){
				this.hero.turnleft();
			}else{
				this.hero.turnright();
			}
		},
		deactive: function() {
			this.destory();
		},
		destory: function() {
			if(this.hero)
				this.hero.removeFromParent();
			this.removeAllChildren();
			this.removeFromParent();
			game.stage.off();
			this.hero = null;
		},
		heroStopBlock:function(){
			this.hero.speedx = 0;
			this.hero.speedy = 0;
			this.hero.targetx = this.hero.posx;
			this.hero.targety = this.hero.posy;
			this.hero.switchState('idle',6);
		},
		initBlocks:function(blockdata){
			for(var i=0;i<blockdata.length;i++){
				var rect = blockdata[i];
				var w = rect[2];
				var h = rect[3];
				var x = rect[0];
				var y = rect[1];
				if(game.configdata.NOLINE){
					var g = new Hilo.Graphics({width:w,height:h,x:x,y:y});
					g.lineStyle(1,"#00f").drawRect(0,0,w,h).endFill().addTo(this);
				}
			}
		},
		checkInBlocks:function(mousex,mousey){
			var isIn = false;
			for(var i=0;i<this.blocks.length;i++){
				var rect = this.blocks[i];
				var w = rect[2];
				var h = rect[3];
				var x = rect[0];
				var y = rect[1];
				if(mousex > x && mousex < x+w && mousey > y && mousey < y+h){
					isIn = true;
					break;
				}
			}
			return isIn;
		},
		checkBlocks:function(){
			for(var i=0;i<this.blocks.length;i++){
				var rect = this.blocks[i];
				var w = rect[2];
				var h = rect[3];
				var x = rect[0];
				var y = rect[1];
				if(
					(this.hero.speedx < 0 && Math.abs(this.hero.posx -(x+w) ) < 20  && (this.hero.posy > y && this.hero.posy < y+h)) ||
					(this.hero.speedx > 0 && Math.abs(this.hero.posx - x)	  < 20  && (this.hero.posy > y && this.hero.posy < y+h)) ||
					(this.hero.speedy > 0 && Math.abs(this.hero.posy - y)     < 5  && (this.hero.posx > x && this.hero.posx < x+w))  ||
					(this.hero.speedy < 0 && Math.abs(this.hero.posy - (y+h))< 10  && (this.hero.posx > x && this.hero.posx < x+w))
				)
				{
					this.heroStopBlock();
				}
			}
		},
		checkStar:function(star){
			if(star && star.parent){
				if(Math.abs(star.x - this.hero.posx) < 100 && Math.abs(star.y - this.hero.posy) < 100){
					star.hide();
					
				}
			}
		},
		checkFinger:function(index){
			if(this.fingerMouse.index != index){
				this.fingerMouse.setDefault();
				game.headPanel.sayNo();
				return false;
			}else{
				return true;
			}
		},
		checkActiveItemWithoutPos:function(mouseX,mouseY,obj){
			var isClickIn = false;
			if(!obj)
				return false;
			var x = obj.clickArea[0]+obj.x;
			var y = obj.clickArea[1]+obj.y;
			var w = obj.clickArea[2];
			var h = obj.clickArea[3];
			if(mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h && obj.status == 1){
				isClickIn = true;
			}
			return isClickIn;
		},
		
		checkActiveItem:function(mouseX,mouseY,obj){
			var isClickIn = false;
			if(!obj)
				return false;
			var x = obj.clickArea[0]+obj.x;
			var y = obj.clickArea[1]+obj.y;
			var w = obj.clickArea[2];
			var h = obj.clickArea[3];
			

			if(mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h && obj.status == 1){
				if(!this.hero){
					return true;
				}
				if(Math.abs(x+w/2 - this.hero.posx) <150 && Math.abs(y+h/2 - (this.hero.posy-100)) <200){
					isClickIn = true;
					this.fingerMouse.active = false; 
				}else{
					isClickIn = false;
					this.herowalk(obj.x + obj.targetx,obj.y+obj.targety);
				}
			}
			return isClickIn;
		},
		layoutUI:function(){
			if(game.uiscene){
				if(game.uiscene.depth < this.depth){
					game.stage.swapChildren(this, game.uiscene);
				}
			}else{
				this.initUI();
			}
		},
		initUI:function(){
			game.uiscene = new Hilo.Container({}).addTo(game.stage);
			game.drdialog = new game.DrDialog({
				x:180,
				y:150,
				visible:false,
			}).addTo(game.uiscene);
			game.headPanel = new game.TopHeadPanel({
				healthValue:game.configdata.DEFAULTHEROHP,
				headImgUrl:'headicon2',
				healthIcon:'heart02',
				healthIconBlack:'heart01',
				x:20,
				y:20,
			}).addTo(game.uiscene);
			game.helpbtn = new Hilo.Bitmap({
				image:'img/help.png',
				y:150,
				x:30,
			}).addTo(game.uiscene);
			//this.setHelp();
		},
		setHelp:function(){
			var scene = this;
			game.helpbtn.off();
			game.helpbtn.on(Hilo.event.POINTER_START,function(e){
				scene.showDialog(scene.helpnote);
			});
		},
		herowalk:function(targetx,targety){
			this.hero.switchState('walk',5);
			var disX = targetx - this.hero.posx;
			var disY = targety - this.hero.posy;
			var angle = Math.atan2(disY,disX);
			this.hero.speedx = Math.cos(angle) *  this.hero.speed ;
			this.hero.speedy = Math.sin(angle) *  this.hero.speed ;
			this.hero.targetx = targetx;
			this.hero.targety = targety;
			if(disX < 0)
				this.hero.turnleft();
			else
				this.hero.turnright();
		},
		initTouchEvent:function(){
			var scene = this;
			game.stage.off();
			game.stage.on(Hilo.event.POINTER_MOVE, function(e) {
				if(scene.ignoreTouch){
					return;
				}
					
				var stagex = e.stageX;
				var stagey = e.stageY;
				var targetx = stagex - scene.x;
				var targety = stagey - scene.y;
				scene.fingerMouse.x = targetx-7;
				scene.fingerMouse.y = targety;
				if(scene.checkShowFingerObjects(targetx,targety)){
					scene.fingerMouse.visible = true;
				}else{
					if(!this.active)
						scene.fingerMouse.visible = false;
				}
				/*if(game.toolspanel.y == 0){
					console.log('check icon');
					game.toolspanel.showshader(targetx,targety);
				}*/
			});
			game.stage.on(Hilo.event.POINTER_START, function(e) {
				scene.onTouchStart(e);
			});
			game.stage.on(Hilo.event.POINTER_END, function(e) {
				scene.onTouchEnd(e);
			});
		},
		onTouchMove:function(e){
			
		},
		onTouchEnd:function(e){
			
		},
		onTouchStart:function(e){
			var  scene = this;
			if(scene.ignoreTouch)
				return;
			var stagex = e.stageX;
			var stagey = e.stageY;
			var targetx = stagex - scene.x;
			var targety = stagey - scene.y;
			
			if(scene.checkActiveObjects(targetx,targety)){
				console.log('on active obj');
			}else{
				if(!scene.checkInBlocks(targetx,targety)){
					if(scene.hero){
						scene.herowalk(targetx,targety);
					}
				}
			}
		},
	});
})(window.game);