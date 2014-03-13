/****************************************************************************
 Copyright (c) 2010-2012 cocos2d-x.org
 Copyright (c) 2008-2010 Ricardo Quesada
 Copyright (c) 2011      Zynga Inc.

 http://www.cocos2d-x.org

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 ****************************************************************************/

var SysMenu = cc.Layer.extend({
    isMouseDown:false,
    helloImg:null,
    helloLabel:null,
    circle:null,
    sprite:null,
    begin:false,
    size:{},
    init:function () {

        //////////////////////////////
        // 1. super init first
        this._super();
         this.pipes = [];
        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask director the window size
        size = cc.Director.getInstance().getWinSize();
        this.size = size;

         // accept touch now!

        if (sys.capabilities.hasOwnProperty('keyboard'))
            this.setKeyboardEnabled(true);

        if (sys.capabilities.hasOwnProperty('mouse'))
        /*if ('mouse' in sys.capabilities)*/
            this.setMouseEnabled(true);

        if (sys.capabilities.hasOwnProperty('touches'))
        /*if ('touches' in sys.capabilities)*/
            this.setTouchEnabled(true);   


        //背景图
        this.sprite = cc.Sprite.create(s_ALL, cc.rect(0, 0, 288, 512));
        this.sprite.setAnchorPoint(0.5, 0.5);
        this.sprite.setPosition(size.width / 2, size.height / 2);
        this.sprite.setScale(size.width/this.sprite.getContentSize().width);
        this.addChild(this.sprite, 0);
        //准备
        this.ready = cc.Sprite.create(s_ALL, cc.rect(584, 182, 113, 98));
        this.ready.setAnchorPoint(0.5, 0.5);
        this.ready.setPosition(size.width / 2, size.height / 2);
        this.addChild(this.ready, 0);
        var rate = size.width/this.sprite.getContentSize().width;
        //地面 

        this.soil = cc.Sprite.create(s_ALL, cc.rect(584, 0, 336, 112));
        this.soil.setAnchorPoint(0, 0.5);
        this.soil.setPosition(0, 0);
        this.soil.setScale(size.width/this.sprite.getContentSize().width);

        var soil = {};
        soil.moveleft = cc.MoveBy.create(1, cc.p(-(24*rate), 0));
       
        var fun =cc.CallFunc.create(function(){
            this.soil.setPosition(0,0);
        },this);
        soil.seq = cc.Sequence.create(soil.moveleft, fun);
        soil.forever = cc.RepeatForever.create(soil.seq);
        this.soil.runAction(soil.forever);
        this.addChild(this.soil, 9999);


            
        var frame = [];
        frame.push(cc.SpriteFrame.create(s_ALL, cc.rect(174, 982, 34, 24)));
        frame.push(cc.SpriteFrame.create(s_ALL, cc.rect(230, 658, 34, 24)));
        frame.push(cc.SpriteFrame.create(s_ALL, cc.rect(230, 710, 34, 24)));
        frame.push(cc.SpriteFrame.create(s_ALL, cc.rect(230, 658, 34, 24)));

        var animation = cc.Animation.create(frame, 0.1);
        var animate = cc.Animate.create(animation,false);

        this.space = new cp.Space();
        var body = new cp.Body(1, cp.momentForBox(1, 34, 24) );
        // body.setPos({x:100, y:size.height / 2+50});
        // this.space.addBody( body );
        // var shape = new cp.BoxShape( body, 34, 24);
        // shape.setElasticity( 0.5 );
        // shape.setFriction( 0.5 );
        // this.space.addShape( shape );

        // this.bird = cc.PhysicsSprite.create();
        // this.bird.setBody( body );
        this.fen = 0;
        this.bird = cc.Sprite.create();
        this.bird.setAnchorPoint(0.5, 0.5);
        this.bird.setPosition(100, size.height / 2+50);
        this.bird.radius = 12*rate;
        var moveup = cc.MoveBy.create(0.2, cc.p(0, -5));
        var movedown = cc.MoveBy.create(0.2, cc.p(0, 5));

        var seq = cc.Sequence.create(moveup, movedown);

        var action = cc.Spawn.create(seq, animate);

        var forever = cc.RepeatForever.create(action);
        this.bird.forever = forever;
        this.bird.runAction(forever);

        this.addChild(this.bird, 0);
        this.scheduleUpdate();

    },
    onTouchesBegan:function (touches,event) { 
        window(touches[0].locationInView().x);  
    },
    onMouseDown:function (event) {
       this._down();
    },
    _down:function(){
        //开始
        if(!this.begin){
           
            this.ready.runAction(cc.FadeOut.create(1));
            this.begin = true;
            this.schedule(this._schedule, 2);
            this.bird.stopAction(this.bird.forever);
        }
        this.birdup();
       
    },
    _schedule:function(){
        var a = new Pipe();

        a.setItPosition(this.size.width);
        this.pipes.push(a);
        this.addChild(a, 0);
        a._move(this.size.width);
    },
    update:function (dt) {
        var pos = this.bird.getPosition();
        
        if(this.pipes.length>0){
            if(this.pipes[0].isPeng(pos,this.bird.radius)){
                this.cleanup();
            }
            if(this.pipes[0].isGuo(pos,this.bird.radius)){
                this.pipes.splice(0,1);
                this.fen++;
                console.log(this.fen);
            }
        }

    },
    birdup : function(){
        var frame = [];
        frame.push(cc.SpriteFrame.create(s_ALL, cc.rect(174, 982, 34, 24)));
        frame.push(cc.SpriteFrame.create(s_ALL, cc.rect(230, 658, 34, 24)));
        frame.push(cc.SpriteFrame.create(s_ALL, cc.rect(230, 710, 34, 24)));
        frame.push(cc.SpriteFrame.create(s_ALL, cc.rect(230, 658, 34, 24)));

        var animation = cc.Animation.create(frame, 0.1);
        var animate = cc.Animate.create(animation,false);

        this.bird.stopAction(this.bird.up);
        var self = this;
        var up = cc.MoveBy.create(0.3, cc.p(0, 60));
        var time = 0;
        var height = 0;

        height = self.bird.getPosition().y+60;
        time = height/350;
        //console.log(time);
        //console.log(-height)

        var down = cc.MoveBy.create(time, cc.p(0, -height));
        var downease = cc.EaseOut.create(down,0.9);
        var rotateup = cc.RotateTo.create(0,-30);
        var rotatedown = cc.RotateTo.create(0.6,90);
        var upease = cc.EaseIn.create(up,0.5);
        var upSpawn = cc.Spawn.create(upease,animate,rotateup);
        var downSpawn = cc.Spawn.create(downease,rotatedown);

        this.bird.up = cc.Sequence.create(upSpawn,downSpawn);
        this.bird.runAction(this.bird.up);
    }
    
});

SysMenu.scene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new SysMenu();
        this.addChild(layer);
        layer.init();
    }
});
