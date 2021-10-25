export const carousel = (project, container, index) => {

  const assetsBasePath = "src/assets/";

    //
   var activeID = 0,
    previousActiveID = 0,
    itemW = window.innerWidth,
    carousel_count,
    $carouselContainer,
    $carouselItems,
    $carouselItem,
    $arrowPrev,
    $arrowNext,
    $itemArrow,
    $navDot,
    $navDots,
    swipeDir,
    slideSpeed = .45,
    slideMeth = Power2.EaseInOut,
    backgroundImage;
   
function createCarousel () {
  let contentPage = project["pages"][0];
  if (contentPage) {
      let carouselContainer = document.createElement('div');
      carouselContainer.className="carousel_container";
      
      let carouselItems = document.createElement('div');
      carouselItems.className="carousel_items";

      let list = document.createElement('ul');
      
      project["pages"].forEach((page, index) => {
          addPage(page, list, index);
      });

      carouselItems.appendChild(list);
      carouselContainer.appendChild(carouselItems);
      addCarouselNavigation(carouselContainer);

      carouselContainer.style.maxHeight = 0;
      container.appendChild(carouselContainer)
  }
}

const addPage = (pageData, container, index) => {
  const pageImage = assetsBasePath + pageData["image"];
  const pageLegend = pageData["legend"];
  const pageDescription = pageData["description"];
  const isFullscreen = pageData["fullscreen"];

  let projectPageDiv = document.createElement('li');
  projectPageDiv.id = "item_" + index;
  projectPageDiv.className = "carousel_item";
  
  let contentContainer = document.createElement('div');
  contentContainer.classList.add("project_content_container");
  projectPageDiv.appendChild(contentContainer);

  let imageContainer = document.createElement('div');
  imageContainer.classList.add("project_image_container", isFullscreen ? "fullscreen" : (pageDescription ? null : "center"));
  contentContainer.appendChild(imageContainer);

  if (!isFullscreen) {
      let image = document.createElement('img');
      image.classList.add("project_image")
      image.src= pageImage;
      imageContainer.appendChild(image);
  } 
  
  if (pageData["legend"]) {
      let legend = document.createElement('span');
      legend.classList.add("project_legend", !isFullscreen && !pageDescription ? "center" : null, isFullscreen ? "fullscreen" : null)
      legend.innerHTML = pageLegend;
      contentContainer.appendChild(legend);
      // imageContainer.appendChild(legend);
      // $(imageContainer).append($(legend).detach());
  }
  
  if (pageData["description"]) {
      let description = document.createElement('span');
      description.classList.add("project_description")
      description.innerHTML = pageDescription;
      projectPageDiv.appendChild(description);
  }

  container.appendChild(projectPageDiv);
}

const addCarouselNavigation = (container) => {
  let itemArrows = document.createElement('div');
  itemArrows.className = "item_arrows";

  let itemPrevious = document.createElement('img');
  itemPrevious.classList.add("item_arrow", "item_prev");
  itemPrevious.src=assetsBasePath + "arrow_left.svg"
  
  let itemNext = document.createElement('img');
  itemNext.classList.add("item_arrow", "item_next");
  itemNext.src=assetsBasePath + "arrow_right.svg"

  itemArrows.appendChild(itemPrevious);
  itemArrows.appendChild(itemNext);

  container.appendChild(itemArrows);
  
  // let navDots = document.createElement('div');
  // navDots.className = "nav_dots"
  // container.appendChild(navDots);
}

function findElements () {
  carousel_count = $(container).find('.carousel_item').length;
  $carouselContainer = $(container).find('.carousel_container');
  $carouselItems = $(container).find('.carousel_items');
  $carouselItem = $(container).find('.carousel_item');
  $arrowPrev = $(container).find('.item_prev');
  $arrowNext = $(container).find('.item_next');
  $itemArrow = $(container).find('.item_arrow');

  // $navDots = $('.nav_dots');
}

 function init() {
    
  createCarousel();
  findElements();

  setTimeout(() => {
    $carouselContainer.addClass("visible");
    checkFullscreen(0);
    setTimeout(() => {
      container.scrollIntoView({inline: "center", "behavior": "smooth"});
    }, 500);
  }, 10)

   $carouselItems.css({'width': (itemW * carousel_count) + 'px'});
  //  $navDots.css({'width': (25 * carousel_count) + 'px'});
   $itemArrow.css({'opacity': .8});
   
   setupDraggable();
  //  setupDots();
   navigateSlide();
   }

 init();
   
 function setupDraggable() { 
     
   Draggable.create($carouselItems, {
           type:'x',
           edgeResistance: 0.90,
           dragResistance: 0.0,
           bounds:'.carousel_container',
           onDrag:updateDirections,
           onThrowUpdate:updateDirections,
           throwProps:true,
           onDragStart:function(evt) {},
           onDragEnd :function() {

             if(swipeDir == 'left') {activeID++}
             else if(swipeDir == 'right') {activeID--};
             
             navigateSlide();
           }
     });    
 };
               
 // set up dots
 function setupDots() {    
   for(var i = 0; i < carousel_count; i++) {
     $navDots.append('<div class="nav_dot" id="dot_' + i + '"></div>');
   }    
   $navDot = $('.nav_dot');
 }  
 
function checkFullscreen(index) {
  let page = $carouselItem[index];
if ($(page).has("div.fullscreen").length) {
      backgroundImage = document.createElement('img');
      backgroundImage.src = assetsBasePath + project["pages"][index]["image"];
      backgroundImage.className = "project_fullscreen_image";
      backgroundImage.style.display = "none";
      container.appendChild(backgroundImage);

      $(window).scroll(function() {
      var scrollTop = $(this).scrollTop();
    
      $(backgroundImage).css({
        opacity: function() {
          var $this = $(this);
          var offset = $this.offset();
          var height = $this.height();

          return 1 - (Math.abs(offset.top - scrollTop))/height
        }
      });
    });

    $(backgroundImage).fadeIn();
    } else {
      $(backgroundImage).fadeOut(() => {
        $(backgroundImage).remove();
      });
    }
  }

 // navigate slide
   function navigateSlide() {
       
       if(activeID >= carousel_count-1) activeID = carousel_count-1;
       if(activeID <= 0) activeID = 0;		
                       
       var xTarget = ((activeID * itemW) * -1);
       
       TweenMax.to($carouselItems, slideSpeed, {x: xTarget, ease: slideMeth, onComplete: slideDone});
   }
   
   function slideDone() {
       
      //  $navDot.css({backgroundColor: '#fff'});
   
      //  TweenMax.to($navDot, .35, {scale: 1, color: 0xFFFFFF});
      //  TweenMax.to($('#dot_' + activeID), .35, {scale: 1.5, backgroundColor: 'transparent',color: 0xCC0000});
      
      if (previousActiveID != activeID) {
        previousActiveID = activeID;
        if ($carouselItem[activeID]) {
          // let page = $carouselItem[activeID];
          checkFullscreen(activeID);
        }
      }

   //
   if(activeID == 0) {$arrowPrev.fadeOut()} 
   else {$arrowPrev.fadeIn()}
   
   if(activeID + 1 == carousel_count) {$arrowNext.fadeOut()}
   else {$arrowNext.fadeIn()}
   }
   
   //
   function updateDirections() {
       swipeDir = this.getDirection("start");
   }
     
 //$itemArrow.click(function() {
 $itemArrow.on('click', function() {
   
   if(Modernizr.touch) return;
   
   if($(this).hasClass('item_next')) {activeID++}
   else {activeID--};
   
   navigateSlide();
   });
 
 $itemArrow.on('touchstart', function() {
   if($(this).hasClass('item_next')) {activeID++}
   else {activeID--};
   
   navigateSlide();
   });
 
//    $navDot.hover(		
//        function() {			
//            TweenMax.to($(this), .35, {scale: 1.5});
//        }, function() {
//             if($(this).attr('id').split('_')[1] == activeID) return;
//           TweenMax.to($(this), .35, {scale: 1.0});
//        }  
//    );
   
//  $navDot.click(function() {		
//    var dotID = $(this).attr('id').split('_')[1];
//        activeID = dotID;
           
//      navigateSlide();		
//    });
 
   //
   $carouselItem.mousedown(function() {		
       activeID = $(this).attr('id').split('_')[1];
   
   $(this).removeClass('grab');
   $(this).addClass('grabbing');
   
   });
 
 //   
 $carouselItem.mouseenter(function() {        
   $(this).removeClass('grabbing');
   $(this).addClass('grab');
 });

 $carouselItem.mouseup(function() {        
   $(this).removeClass('grabbing');
   $(this).addClass('grab');
 });  
 
};