/*
 * @Author: Yuhong Wu
 * @Date: 2024-04-23 20:09:16
 * @LastEditors: Yuhong Wu
 * @LastEditTime: 2024-05-02 16:36:02
 * @Description: 
 */
var streams = [];
var fadeInterval = 1.6;
var figure;
var hasFigure = false;
var kinectron = null;
var frames = 0;

var symbolSize = 18;
var name_list = ["Lau Sin Ting", "Ng Ka Hei", "Wong Hoi Ching", "Leung Chi Pang", "Wong Sze Ki", "Sum Ka Po",
 "To Tsz Yi", "Huang Yong Qi", "Chak Lai Wai", "Wong Wing Tsun", "Law Pui Yee", "Lau Oi Yu", "Cheung Wing Tung",
  "Ngan Yee Ling", "Wu Lok Yi", "Tsui Tsz Kin", "Kwan Yee Ting", "Ma On Sang", "Song Jiayi", "Chan Chi Wing",
  "Leung Hiu Yan", "Tong Hoi Lam", "Chan Hei Man", "Ng Chun Yung", "Tsui Chung Lam", "Lau Ho Fai", "Cheung Chun Hin",
  "Nancy Chen", "Kwan Ka Ying", "Gong Yanni", "Lau Suen Yi", "Xie Siying", "Tsang Tiffany", "Wong Chun Jun",
  "Yung Kwok Hei", "Wong Ka Lok", "Nada Aboussaid", "Apousidou Alexandra", "Tong Po Yee", "Chan Nga Yee", "Irina cozma", "Lau Cheuk Yin",

 "Central", "Yuen Long", "Sung Wong Toi", "Kowloon Tong", "Tsuen Wan", "Heng Fa Chuen", "Tin Hau", "Tsing Yi",
 "Choi Hung", "Tsuen Wan West", "Kwun Tong", "Tai Po", "Kennedy Town", "Wu Kai Sha", "Kowloon Bay", "Wong Chuk Hung",
 "Wong Tai Sin", "Ma On Shan", "Disneyland", "Kwai Hung", "YauTong", "Olympic", "Causeway Bay", "Tseung Kwan",
 "Nam Cheong", "Sham shui Po", "Sai Ying Pun", "Mong Kok", "Quarry Bay", "Hin Keng", "Tai Wai", "East Tsim Sha Tsui",
 "Tung Chung", "Sha Tin Racecourse", "Airport", "Kwai Fong", "Whampoa", "Kowloon", "Chai Wan", "Kai Tai", "Diamond Hills",
 "Sai Wan Ho"];
var nameCount = 42;
var minspeed = 5;
var maxspeed = 15;
var minGrayScale = 6;
var stream_per_line = 2;
var kinectronIpAddress = "202.125.199.59"; 

function preload() {
  backgroundImg = loadImage('bg.jpg');
  backgroundImg.resize(width, height);
}

function setup() {
  createCanvas(
    windowWidth,
    windowHeight
  );
  frameRate(30);

  var x = 0;
  for (var i = 0; i <= width / symbolSize; i++) {
		for (var j = 0; j <= stream_per_line; j++){
			var stream = new Stream(round(random(0,name_list.length-1)));
			stream.generateSymbols(x, random(-2000, 0));
			streams.push(stream);
		}
    x += symbolSize
  }

  textFont('Consolas');
  textSize(symbolSize);

  initKinectron()
}

function initKinectron() {
  // define and create an instance of kinectron
  kinectron = new Kinectron(kinectronIpAddress);
  kinectron.setKinectType("windows");

  // connect with application over peer
  kinectron.makeConnection();
  print("Kinect connected");

  kinectron.startKey(onKeyReceive);
}

function onKeyReceive(colorImage){
  figure = loadImage(colorImage.src, handleImage);
}

function handleImage(img){
  print("Img loaded");
  img.resize(width, height);
  img.filter(GRAY);
  figure.loadPixels();
  hasFigure = true;
}

function draw() {
  background(0);
  streams.forEach(function(stream) {
    stream.render();
  });
  frames = frames > 1000? 0: frames+1;
  hasFigure = frames % 100 == 0? false: hasFigure;
	text(mouseX+"-"+mouseY,mouseX,mouseY);
  let fps = frameRate();
  text(fps,50,50);
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
		// this.x = (this.x <= 0) ? width : this.x -= this.speed;
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
			// var position = 4*(img.width*symbol.y+symbol.x);
      if (symbol.first && symbol.isName) {
        fill(140, 255, 170, symbol.opacity);
      } else {
        fill(0, 255, 70, symbol.opacity);
      }
      if(figure && hasFigure){
        var position = 4*(figure.width*symbol.y+symbol.x);
        if(symbol.x<figure.width && symbol.y<figure.height && figure.pixels[position] > minGrayScale){
            fill(255,0,0)
            rect(symbol.x,symbol.y,10,10);
          	// text(symbol.value, symbol.x, symbol.y);
          }
      }
			text(symbol.value, symbol.x, symbol.y);
      symbol.rain();
      // symbol.setToRandomSymbol();
    });
  }
}