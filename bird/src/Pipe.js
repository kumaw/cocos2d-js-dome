var Pipe = cc.Layer.extend({
	pipetop:null,
	pipebottom:null,
	height:100,
	ly:0,
	ctor:function(){
		var ly = Math.floor(Math.random()*200+115);
		this.ly = ly;
		this._super();
		this.pipetop = cc.Sprite.create(s_ALL,cc.rect(112,646,52,320));
        this.pipebottom = cc.Sprite.create(s_ALL,cc.rect(168,646,52,320));

        this.pipebottom.setAnchorPoint(0, 0);
        this.pipebottom.setPosition(0, -320+ly);

        this.pipetop.setAnchorPoint(0, 0);
        this.pipetop.setPosition(0, ly+this.height);

        this.addChild(this.pipetop);
        this.addChild(this.pipebottom);
	},
	setItPosition:function(x){
		this.pipebottom.setPosition(x, -320+this.ly);
		this.pipetop.setPosition(x, this.ly+this.height);
	},
	_move:function(x){
		
		var moveleft = cc.MoveBy.create(4, cc.p(-x-this.pipetop.getContentSize().width, 0));
		var fun = cc.CallFunc.create(function(){
			console.log('已销毁');
            this.getParent().removeChild(this,true);
        },this);
        var seq = cc.Sequence.create(moveleft, fun);
        var seq1 = seq.clone();
        this.pipetop.runAction(seq);
		this.pipebottom.runAction(seq1);
	},
	isPeng:function(pos,radius){
		//console.log(pos.y-Math.abs(this.pipebottom.getPosition().y));

		//debugger;
		if(Math.abs(pos.x-this.pipetop.getPosition().x)<radius && pos.y-this.pipetop.getPosition().y>0){
			
			return true;
		}else if(Math.abs(pos.y-this.pipetop.getPosition().y)<radius && pos.x>this.pipetop.getPosition().x && pos.x<this.pipetop.getPosition().x+52){
			return true;
		}
	
		if(Math.abs(pos.x-this.pipebottom.getPosition().x)<radius &&  pos.y-this.pipebottom.getContentSize().height-this.pipebottom.getPosition().y<0){
			return true;
		}else if(Math.abs(pos.y-this.pipebottom.getContentSize().height-this.pipebottom.getPosition().y)<radius && pos.x>this.pipebottom.getPosition().x && pos.x<this.pipebottom.getPosition().x+52){
			return true;
		}
		return false;
	},
	isGuo:function(pos,radius){
		if(this.pipetop.getPosition().x+52+radius<pos.x){
			return true;
		}
	}
})