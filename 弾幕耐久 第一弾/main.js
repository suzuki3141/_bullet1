/*//////準備//////*/

const { app } = require("electron");

/*キー設定開始*/
    const keyEnter = 13;
    const keyShift = 16;
    const keyCtrl = 17;
    const keyAlt = 18;
    const keyEsc = 27;
    const keySpace = 32;
    const key0 = 48;
    const key1 = 49;
    const key2 = 50;
    const key3 = 51;
    const key4 = 52;
    const key5 = 53;
    const key6 = 54;
    const key7 = 55;
    const key8 = 56;
    const key9 = 57;
    const keyA = 65;
    const keyB = 66;
    const keyC = 67;
    const keyD = 68;
    const keyE = 69;
    const keyF = 70;
    const keyG = 71;
    const keyH = 72;
    const keyI = 73;
    const keyJ = 74;
    const keyK = 75;
    const keyL = 76;
    const keyM = 77;
    const keyN = 78;
    const keyO = 79;
    const keyP = 80;
    const keyQ = 81;
    const keyR = 82;
    const keyS = 83;
    const keyT = 84;
    const keyU = 85;
    const keyV = 86;
    const keyW = 87;
    const keyX = 88;
    const keyY = 89;
    const keyZ = 90;
    const keyLeft = 37;
    const keyUp = 38;
    const keyRight = 39;
    const keyDown = 40;
/*キー設定終了*/

window.addEventListener("load", update);
let scene = 1;
let updatecnt = 1;                      //再描画回数
const canvas = document.getElementById("main");
const ctx = canvas.getContext("2d");    //キャンバス指定
let playerX;
let playerY;
let playerSpeed;
let startbulletmake = true;
let endspellcard = false;
let startspellcard = false;
var enemyX;
var enemyY;
let spcX = 270;
let spcY = 300;

//描画関数
function render(src, x, y){
    var image = new Image();
    image.src = src;
    ctx.drawImage(image, x, y);
}
//キー入力確認
var input_key = new Array(90);
for(let i = 0;i > 90;i++){
    input_key.push(false)
}
window.addEventListener("keydown", handlekeydown);
function handlekeydown(e){
    input_key[e.keyCode] = true;
}
window.addEventListener("keyup", handlekeyup);
function handlekeyup(e){
    input_key[e.keyCode] = false;
}

function wait(joken,timeout){
    if(timeout == undefined){
        var time = 1000000;
    }
    else{
        var time = timeout * 1000;
    }
    let roop = 0;
    while(joken = true || roop > time){
    setTimeout(function(){roop++;},1);
    }
    if(roop > time){
        return undefined;
    }
    else{
        return (roop / 1000);   //かかった秒数
    }
}
//弾幕描画関連
let bullet = [];
let bullettype = [];
let bulletX = [];
let bulletY = [];
let bulletdir = [];
let bulletspeed = [];
let bulletdraw = [];
let bulletcn1 = [];
let bulletcn2 = [];
let spcflame = [0,0,0,0,0];
const spcflamemax = [15,20,10,4,2];
let time = 0;
let border = [0,0];
let spellcardtime = 99;
let bordersizereset = true;
let standX = 370;
let standY = 10;
const straight = 1;
function newbullet(type,x,y,dir,speed){
        bullet.push("live")
        bullettype.push(type);
        bulletX.push(x);
        bulletY.push(y);
        bulletdir.push(dir);
        bulletspeed.push(speed);
        bulletdraw.push(true);
        bulletcn1.push(0);
        bulletcn2.push(0);
        return bulletdraw.length;
}
function bulletupdate(){
        for (let i = 0; i < bulletdraw.length + 1; i++) {
                switch(bullettype[i]){
                    case 1:
                        let n = bulletdir / 180 * Math.PI;
                        bulletX[i] += Math.cos(n * bulletspeed[i]);
                        bulletY[i] += Math.sin(n * bulletspeed[i]);
                        break;
                }
        }
}
function bulletrender(){
        for(let i = 0; i < bulletdraw.length; i++){
                switch(bullettype[i]){
                        case 1:
                                render("./images/bullet/b1.png", bulletX[i], bulletY[i]);
                                break;
                }
        }
}
function bulletprocess(){
        bulletupdate();
        bulletrender();
}

//UI描画
function setdegrender(src,x,y,deg,width,height){
    ctx.save();
    ctx.translate(x,y)
    ctx.rotate(deg / 180 * Math.PI);
    var image = new Image();
    image.src = src;
    if(width == undefined && height == undefined){
        ctx.drawImage(image, -(image.width/2), -(image.height/2));
    }
    else{
        ctx.drawImage(image, -(width/2), -(height/2), width, height);
    }
    ctx.restore();
}
function UIrender(){
    //spellcardborder
    if(endspellcard == false && startspellcard == true){
        setdegrender("images/spellcardborder.png",enemyX + 16,enemyY + 33,border[0],border[1],border[1]);
        border[0] += 4;
        if(border[1] < 800 && bordersizereset == true){
            border[1] += 25;
        }
        else{
            bordersizereset = false;
        }
        if(time > 2){
            border[1] -= 0.21328;
        }
    }
    //spellcardstandimage
    if(time > 2 && time < 4){
        if(endspellcard == false)
            standY += 2;
            render("images/standpicture.png",standX,standY);
        }
    //time
    let n1 = Math.floor(spellcardtime / 10);
    let n2 = Math.floor(spellcardtime - n1 * 10);
    let _n1 = "images/time/" + n1 + ".png"
    let _n2 = "images/time/" + n2 + ".png"
    render(_n1,570,15);
    render(_n2,600,15);
    //スペルカード名
    if(time > 2){
        if(endspellcard == false){
            if(spcY > 60 && time > 3){spcY -= 6;}
            render("images/spellcard.png",spcX,spcY);
            if(startspellcard == false){
                spellcardtime = 61;
                startspellcard = true;
            }
        }
    }
    //敵の名前
    render("images/enemyname.png",30,30);
}

//ここからmain
function update(){
    ctx.clearRect(0, 0, 1024, 768);
    updatecnt++;
    if(scene == 1){
        time = 0;
    }
    //描画
    objectupdate();
    forerender();

    window.requestAnimationFrame(update);   //60fps
}
function forerender(){
    switch(scene){
        case 1:
            var image = new Image();
            image.src = "./images/title.png";
            ctx.drawImage(image, 0, 0);
            break;
        case 2:
            var image = new Image();
            image.src = "./images/stage.png";
            ctx.drawImage(image, 0, 0);
            break;
        case 3,4:
            var image = new Image();
            image.src = "./images/stage.png";
            ctx.drawImage(image, 0, 0);
            break;
    }
}
function objectupdate(){
    switch(scene){
        case 1:
            if(input_key[keyX]){
            playerX = 300;
            playerY = 660;
            playerSpeed = 5;
            enemyX = 300;
            enemyY = 110;
            time = 0;
            spellcardtime = 100;

            scene = 2;
            break;
            }
            else if(input_key[keyQ]){
            }
        case 2:
            if(spellcardtime <= 0){
                scene = 4;
            }
            //フレーム加算
            time += (1 / 60);
            spellcardtime -= 0.016;
            //低速か
                if(input_key[keyShift]){
                    playerSpeed = 2;
                }
                else{
                    playerSpeed = 5;    
                }
            //移動
                if(input_key[keyUp]){
                    playerY -= playerSpeed;
                    if(playerY < 20){playerY = 20;}
                }
                if(input_key[keyDown]){
                    playerY += playerSpeed;
                    if(playerY > 686){playerY = 686;}
                }
                if(input_key[keyRight]){
                    playerX += playerSpeed;
                    if(playerX > 591){playerX = 591;}
                }
                if(input_key[keyLeft]){
                    playerX -= playerSpeed;
                    if(playerX < 21){playerX = 21;}
                }
            //背景描画
                render("images/back.png",0,0)
            //弾幕描画
                bulletprocess();
            //プレイヤー描画
                var image = new Image();
                image.src = "./images/chara/Player.png";
                ctx.drawImage(image, playerX, playerY);
            //UI描画
                UIrender();
            //敵描画
                var image = new Image();
                image.src = "./images/chara/Enemy.png";
                ctx.drawImage(image, enemyX, enemyY);
            break;
    }
}