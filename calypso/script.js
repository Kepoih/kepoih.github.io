const AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var successAudio;
var upgradeAudio;

var loaderArray = [];
var upgradeOptionsArray = [];
var upgradesArray = [];
var value = 0;
var maxHeight;
var minHeight;
var centerX;
var centerY;
var nbLoaders = 0;
var nbUpgradeOptions = 0;
var clickerValue = 1;
var autoclickerValue = 0;
var cursorSize = 16;
let COLORS = ['#fce4e4', '#f6afaf', '#ec5757', '#e83434', '#dc1919', '#a71313', '#720d0d', '#2c0505', '#2c0505', '#252000', '#605300', '#9b8600', '#d6b900', '#fddb00', '#ffe439', '#ffef87', '#fff9d5', '#ffffff'];
var upgradeTemplate;
var cursorBlob;
var confettiAnimation;
var nextThreshold = 0;

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

const numberWithSeparators = (x) => x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

jQuery(() => {
    document.getElementsByClassName('heart-ref')[0].addEventListener('click', click);
    getHeartSize();
    setInterval(() => {
        autoclick();
    }, 1000);
    upgradeTemplate = document.querySelector("#upgrade-template");
    fetch('pointer.webp').then(r => {
        r.blob().then((blob) => {
            cursorBlob = blob
            getCursor();
        });
    });

    confettiAnimation = lottie.loadAnimation({
        container: document.getElementById('lottie-confetti'),
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: 'confetti2.json',
    });
    confettiAnimation.addEventListener('complete', () => {
        confettiAnimation.goToAndStop(0);
    })

    successAudio = document.getElementById('successAudio');
    upgradeAudio = document.getElementById('upgradeAudio');
})

function getHeartSize() {
    let heartFrame = $('.heart-ref')[0].getBoundingClientRect();
    maxHeight = heartFrame.top;
    minHeight = heartFrame.bottom ;
    centerY = heartFrame.top +  heartFrame.height/2;
    centerX = heartFrame.left +  heartFrame.width/2;
    console.log("center X : ", centerX);
    console.log("center Y : ", centerY);
}

function setLoaderValue(n, val) { // sets the height of the loading bar based on the value, or removes the bar if it shouldn't appear
    let newTop, min, max;
    switch (n) {
        case 0:
            min = 0;
            max = 1;
            break;
        case 1:
            min = 2;
            max = 10;
            break;
        default:
            min = 10 ** (n-1) + 1;
            max = 10 ** n;
            break;
    }
    if(val < min) { // Remove loader bar
        let elt = loaderArray.pop();
        elt.remove();
        nbLoaders --;
        return;
    } else if (val >= max) {
        newTop = maxHeight;
    } else { // Set value
        newTop = Math.floor(map(val, min, max, minHeight, maxHeight));
    }
    loaderArray[n].style.top = newTop + 'px';
}

function getNbLoaders(val) {
  if (val == 0) return 0;
  else if (val == 1) return 1;
  else return Math.floor(Math.log10(val-1)) + 2;
}

function updateDisplay(oldVal, newVal) {
    $('#counter').text(numberWithSeparators(newVal));
    let oldNbLoaders = getNbLoaders(oldVal);
    let newNbLoaders = getNbLoaders(newVal);
    if(oldNbLoaders < newNbLoaders) {
        addLoader();
    }
    for (let i=loaderArray.length - 1; i>=0; i--) {
        setLoaderValue(i, newVal);
    }
}

function pulse() {
    $('.outline')[0].animate({
        height: '370px', 
        width: '370px'
    }, 100);
}

function click() {
    if(nbUpgradeOptions == 0) {
        addAutoclickUpgradeOption(0);
        addCursorUpgradeOption(0);
    }
    updateValue(value + clickerValue)
    pulse();
}

function autoclick() {
    if(autoclickerValue) {
        updateValue(value + autoclickerValue);
        pulse();
    }
}

function addLoader() {
    var loader = document.createElement('div');
    loader.classList = 'loader';
    loader.style.top = minHeight + 'px';
    loader.style.background = COLORS[nbLoaders];
    document.getElementById('loader-container').appendChild(loader);
    loaderArray.push(loader);
    nbLoaders++;
    showParticles();
}

function showParticles() {
    if (value != 2) {
        if(value > nextThreshold) {
            confettiAnimation.goToAndPlay(0);
            $('#counter-div').animate({fontSize: '3em'}, 100).animate({fontSize: '2.4em'});
            nextThreshold = getNextThreshold(value);
            successAudio.play();
        }
    }
}

function getNextThreshold(val) {
    if (val == 0) return 1;
    if (val < 10) return 10;
    // Compute next threshold
    return 10**(Math.ceil(Math.log10(val)))
}

function costOfAutoclickUpgrade(n) {
    if (n==0) return 10;
    return 10**(n*3);
}

function costOfCursorUpgrade(n) {
    if (n==0) return 50;
    return 0.25*(10**(n*3));
}

function addAutoclickUpgradeOption(n) {
    var upgrade = document.importNode(upgradeTemplate.content, true);
    upgrade.querySelectorAll('.upgrade-title')[0].innerHTML = `Autoclick - Level ${n}`;
    upgrade.querySelectorAll('.upgrade-cost')[0].innerHTML = `Prix: ${numberWithSeparators(costOfAutoclickUpgrade(n))} ❤️`;
    upgrade.querySelectorAll('.upgrade')[0].addEventListener('click', () => {
        buyAutoclickUpgrade(n);
    })
    document.getElementById('autoclick-upgrade-options').appendChild(upgrade);
    upgradeOptionsArray.push(upgrade);
    nbUpgradeOptions++;
    upgradesArray.push(0);
}

function addCursorUpgradeOption(n) {
    var upgrade = document.importNode(upgradeTemplate.content, true);

    upgrade.querySelectorAll('.upgrade-title')[0].innerHTML = `Super-clicker - Level ${n}`;
    upgrade.querySelectorAll('.upgrade-cost')[0].innerHTML = `Prix: ${numberWithSeparators(costOfCursorUpgrade(n))} ❤️`;
    upgrade.querySelectorAll('.upgrade')[0].addEventListener('click', () => {
        buyCursorUpgrade(n);
    })
    document.getElementById('cursor-upgrade-options').appendChild(upgrade);
}

function buyAutoclickUpgrade(n) {
    let cost = costOfAutoclickUpgrade(n);
    if(value >= cost) {
        updateValue(value - cost);
        upgradesArray[n]++;
        updateAutoclickerValue();
        showAutoclicker(n);
        upgradeAudio.currentTime = 0;
        upgradeAudio.play();
        // Unlock next level upgrade
        if(nbUpgradeOptions == n+1) addAutoclickUpgradeOption(n+1)
    } 
}

function buyCursorUpgrade(n) {
    let cost = costOfCursorUpgrade(n);
    if(value >= cost) {
        updateValue(value - cost);
        clickerValue = Math.floor(cost / 25);
        cursorSize*=1.3;
        getCursor();
        upgradeAudio.currentTime = 0;
        upgradeAudio.play();
        // Unlock next level upgrade if it isn't already unlocked
        $('#cursor-upgrade-options .upgrade').remove();
        addCursorUpgradeOption(n+1)
    } 
}

function updateAutoclickerValue() {
    let value = 0;
    upgradesArray.forEach((upgrades, i) => {
        value += upgrades * costOfAutoclickUpgrade(i)/10; 
    });
    autoclickerValue = value;
}

function showAutoclicker(n) {
    let distance = 220 + Math.random() * 75;
    let size = 32 * 1.4**n;
    let angle = Math.random() * Math.PI * 2;
    var autoclicker = document.createElement('img');
    autoclicker.src = 'hand-cursor.png';
    autoclicker.classList = 'autoclicker';
    autoclicker.style.height = size + 'px';
    autoclicker.style.width = size + 'px';
    autoclicker.style.left = distance * Math.cos(angle) + centerX - size/2 + 'px';
    autoclicker.style.top = distance * Math.sin(angle) + centerY - size/2 + 'px';
    // autoclicker.style.left = centerX - size/2 + 'px';
    // autoclicker.style.top = centerY - size/2 + 'px';
    // autoclicker.style.left = distance * Math.cos(angle) + centerX - 50 + 'px';
    // autoclicker.style.top = distance * Math.sin(angle) + centerY - 50+ 'px';
    autoclicker.style.transform = `rotate(${angle-Math.PI/2}rad)`;
    document.getElementById('autoclicker-container').appendChild(autoclicker);
}

function updateValue(newVal) {
    let oldVal = value;
    value = newVal;
    updateDisplay(oldVal, newVal);
}

function getCursor(){ // Set the cursor image with size depending on upgrade level

    var resize_width = Math.min(Math.floor(cursorSize), 128); //get size of cursor (max supported 128px)
    item = cursorBlob;
    
    //create a FileReader
    var reader = new FileReader();
  
    //image turned to base64-encoded Data URI.
    reader.readAsDataURL(item); 
    reader.name = item.name;//get the image's name
    reader.size = item.size; //get the image's size 
    reader.onload = function(event) { 
        var img = new Image();//create an image 
        img.src = event.target.result;//result is base64-encoded Data URI 
        img.name = event.target.name;//set name (optional) 
        img.size = event.target.size;//set size (optional) 
        img.onload = function(el) {
        var elem = document.createElement('canvas');//create a canvas
  
        //scale the image to 600 (width) and keep aspect ratio
        var scaleFactor = resize_width / el.target.width;
        elem.width = resize_width;
        elem.height = el.target.height * scaleFactor;
  
        //draw in canvas
        var ctx = elem.getContext('2d');
        ctx.drawImage(el.target, 0, 0, elem.width, elem.height);
  
        //get the base64-encoded Data URI from the resize image
        var srcEncoded = ctx.canvas.toDataURL(el.target, 'image/jpeg', 0);
        document.body.style.cursor = 'url("' + srcEncoded + '"), default';
      }
    } 
  }
  