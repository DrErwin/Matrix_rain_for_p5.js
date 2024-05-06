/*
 * @Author: Yuhong Wu
 * @Date: 2024-04-23 20:09:16
 * @LastEditors: Yuhong Wu
 * @LastEditTime: 2024-05-06 23:54:26
 * @Description: 
 */
var streams = [];
var fadeInterval = 1.6;
var symbolSize = 12;
let img;
var name_list = ["Guangdong", "Guangxi", "Beijing",
 "Fujian", "Hebei", "Henan", "Hubei",
  "Hunan", "Yunnan", "Sichuan"];
var nameCount = 4;
var minspeed = 2;
var maxspeed = 6;

// Load the image.
function preload() {
  img = loadImage('mask.jpg');
}

function setup() {
  createCanvas(
    windowWidth,
    windowHeight
  );
  background(0);

  var x = 0;
  for (var i = 0; i <= width / symbolSize; i++) {
		for (var j = 0; j <= 2; j++){
			var stream = new Stream(round(random(0,name_list.length-1)));
			stream.generateSymbols(x, random(-2000, 0));
			streams.push(stream);
		}
    x += symbolSize
  }

  textFont('Consolas');
  textSize(symbolSize);
	
	img.resize(windowWidth/1.5,windowHeight/1.5);
	img.filter(GRAY);
	img.loadPixels();

}

function draw() {
  background(0, 150);
  streams.forEach(function(stream) {
    stream.render();
  });
  // image(img,0,0);
	text(mouseX+"-"+mouseY,mouseX,mouseY);
}

function Symbol(x, y, speed, first, opacity, isName=false) {
  this.x = x;
  this.y = y;
  this.value;

  this.speed = speed;
  this.first = first;
  this.opacity = opacity;
  this.isName = isName;

  this.switchInterval = round(random(2, 25));

  this.setToRandomSymbol = function() {
    var charType = round(random(0, 5));
    if (frameCount % this.switchInterval == 0) {
      if (charType > 1) {
        this.value = String.fromCharCode(
          0x30A0 + round(random(0, 96))
        );
      } else {
        this.value = round(random(0,9));
      }
    }
  }

  this.rain = function() {
    this.y = (this.y >= height) ? 0 : this.y += this.speed;
  }

}

function Stream(id) {
  this.symbols = [];
  // this.totalSymbols = round(random(5, 35));
  this.speed = round(random(minspeed, maxspeed));
	this.id = id;
	this.totalSymbols = name_list[this.id].length;

  this.generateSymbols = function(x, y) {
    var opacity = 255;
    // var first = round(random(0, 4)) == 1;
    var first = true;
    for (var i =0; i <= this.totalSymbols; i++) {
      symbol = new Symbol(
        x,
        y,
        this.speed,
        first,
        opacity,
        this.id > nameCount ? false : true
      );
			// symbol.setToRandomSymbol();
      symbol.value = name_list[this.id].charAt(i);
      this.symbols.push(symbol);
      opacity -= (255 / this.totalSymbols) / fadeInterval;
      y += symbolSize;
      first = false;
    }
  }

  this.render = function() {
    this.symbols.forEach(function(symbol) {
			var position = 4*(img.width*symbol.y+symbol.x);
      if (symbol.first && symbol.isName) {
        fill(140, 255, 170, symbol.opacity);
      } else {
        fill(0, 255, 70, symbol.opacity);
      }
			if(symbol.x<img.width && symbol.y<img.height && img.pixels[position] < 200){
				rect(symbol.x, symbol.y, 10, 10);
			}
			text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      // symbol.setToRandomSymbol();
    });
  }
}