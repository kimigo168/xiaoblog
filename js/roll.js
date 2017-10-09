/*  num scroller plugin__  */
    !function($, undefined){
      var NumScroller = function(arg){
        this.box = $(arg.box);
        this.maxNum = arg.maxNum + 1;
        this.minNum = arg.minNum || 0;
        this.step = arg.step || 1;
        this.sideCount = arg.sideCount;
        this.itemHeight = parseInt(window.getComputedStyle(this.box[0]).height);
        this.curNum = arg.curNum||this.minNum;
        this.deg = 360 / this.sideCount;
        this.tick =  0;
        this.callback=arg.callback||function(){};
        // debugger;
        this.init(arg.originNum);
      }

      NumScroller.prototype = {
        constructor: NumScroller,
        init : function(originNum){
          var self = this,
            rad =  (2 * Math.PI) / this.sideCount,
            line_a = this.itemHeight / 2,
            transZ = line_a / Math.tan(rad / 2),
            box = this.box,
            _tick = Math.floor((originNum-this.minNum)/this.step) || 0,
            i,
            sideCount;
          this.transZ = transZ;
          sideCount = this.sideCount = Math.floor(this.sideCount / 4) * 2 +3;
          this.offset = Math.floor(this.sideCount / 2);
          box.css({
            "-webkit-transform" : "perspective(1000px) translateZ(0) rotateX(" + _tick*self.deg + "deg)",
            "transform" : "perspective(1000px) translateZ(0) rotateX(" + _tick*self.deg + "deg)"
          }).html("")
          for( i = 0 ; i < sideCount; i++){
            box.append("<li></li>");
          }

          this.bindEvent();
          this.freshSide();
          for( i = 0; i < _tick; i++){
            this.ticker(1)
          }
        },
        getValue : function(){
          return this.curNum;
        },
        count : function(num){
          var rang = this.maxNum - this.minNum,
            min = this.minNum,
            num = (( num - min) % rang + rang) % rang + min;
            // num = ((this.curNum + this.step - min) % rang + rang) % rang + min;
          return num;
        },
        freshSide : function(){
          var self = this,
            tick = this.tick,
            transZ = this.transZ,
            child = this.box.children(),
            childCount = child.length
          child.each(function(i){
            var _index = i - self.offset,
              _deg = self.deg * (_index + tick) * -1;

            $(this).css({
              "-webkit-transform" : "rotateX(" + _deg + "deg) translateZ(" +transZ + "px)",
              "transform" : "rotateX(" + _deg + "deg) translateZ(" + transZ + "px)"
            }).text(self.count( (i - self.offset) * self.step + self.curNum))
          })
        },
        ticker : function(direction){
          this.tick += direction;
          var box = this.box,
            target = direction > 0 ? box.children().first().appendTo(box) : box.children().last().prependTo(box),
            _num = this.count(direction * this.step * (this.offset + 1) + this.getValue()),
            _deg = ( this.offset*direction + this.tick) * -1 * this.deg;

          this.curNum = this.count(this.curNum += direction * this.step);
          target.css({
            "-webkit-transform" : "rotateX(" + _deg + "deg) translateZ(" + this.transZ + "px)",
            "transform" : "rotateX(" + _deg + "deg) translateZ(" + this.transZ + "px)"
          }).text(_num)

          // debugger;
        },
        bindEvent : function(){
          var box = this.box,
            o_deg = parseFloat(box[0].style.cssText.match(/rotateX\((\d*)deg\)/)[1]),
            p_start = 0,
            self = this,
            new_deg = 0,
            p_last = 0,
            distance
          box.on("touchstart", function(e){
            e.preventDefault();
            p_start = e.touches[0].clientY;
          })
          box.on("touchmove", function(e){
            var _tick;
            e.preventDefault();
            p_last = e.touches[0].clientY
            distance = p_last - p_start;
            new_deg = (-distance * 180) / (Math.PI*self.transZ) + o_deg;
            _tick = Math.round(new_deg / self.deg);
            // debugger
            box.css({
              "-webkit-transform" : "perspective(1000px) translateZ(0) rotateX(" + new_deg + "deg)",
              "transform" : "perspective(1000px) translateZ(0) rotateX(" + new_deg + "deg)"
            })
            if(self.tick != _tick){
              self.ticker( _tick - self.tick)
              self.tick = _tick;
            }
            self.freshSide() //fix
          })
          box.off('touchend').on("touchend", function(e){
            o_deg = new_deg;
            if(distance){
              var _deg = Math.round( new_deg/self.deg ) * self.deg;
              box.animate({
                "-webkit-transform" : "perspective(1000px) translateZ(0) rotateX(" + _deg + "deg)",
                "transform" : "perspective(1000px) translateZ(0) rotateX(" + _deg + "deg)"
              }, 100);
            }

            self.callback.call()
          })
        }
      }
      $.NumScroller = NumScroller;
    }(Zepto)
