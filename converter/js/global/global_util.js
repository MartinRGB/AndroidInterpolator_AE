// ## Global Animator Data Util ##

var mListChoosenCalculatorType;
var mListChoosenInterpolatorType;
var mListChoosenConverterType;

function setCurrentCalculatorType(calc){
  mListChoosenCalculatorType =calc;
}

function setCurrentInterpolatorType(intp){
  mListChoosenInterpolatorType = intp;
}

function setCurrentConverterType(conv){
  mListChoosenConverterType = conv;
}

function getCurrentCalculatorType(){
  return mListChoosenCalculatorType;
}

function getCurrentInterpolatorType(){
  return mListChoosenInterpolatorType;
}

function getCurrentConverterType(){
  return mListChoosenConverterType;
}


// ## TimePara Util ##

function listSelectEstimatedPara(calculatorData,timeParaE){

  if(calculatorData.duration != null){
    if(calculatorData.transition != null){
      timeParaE.innerHTML = 'Estimated time - ' + (Math.abs(calculatorData.duration)*1000).toFixed(0) + 'ms    |    Transition - ' + calculatorData.transition.toFixed(0) +'f'
    }
    else{

      //timeParaE.innerHTML = 'Calculating..'

      var myCalculationWorker = new Worker("./js/converter/CustomSpringInterpolatorEvaluatorInWorker.js");

      myCalculationWorker.postMessage([calculatorData.stiffness,calculatorData.damping,calculatorData.duration]);

      
      myCalculationWorker.onmessage = function(e) {
        //console.log('Message received from worker');
        timeParaE.innerHTML = e.data;   
        myCalculationWorker.terminate();   
      }

    }
    timeParaE.style.zIndex = 0;
  }
  else{
    timeParaE.innerHTML = ''
    timeParaE.style.zIndex = -1000;
  }
}

// ## Resize Canvas Util ##
function resizeCanvas(canvas,width,height,graphContianer,bezierContainer,timePara){
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  bezierContainer.style.width = width +'px'
  bezierContainer.style.height = height +'px'
  //timePara.style.left = 

  canvas.width = width*2;
  canvas.height = height*2;
  graphContianer.style.width = width + 'px';
  bezierContainer.style.transform = 'translate3d(-8px,-'+(height+12)+'px,0px)'; 


  windowResizeCanvas(canvas,graphContianer)
}

function windowResizeCanvas(canvas,graphContianer){
  var width = document.body.clientWidth;
  var height = document.body.clientHeight;
  if(canvas.style.width == '340px' && width<563){
    //mSpringGraphTranslateX.setEndValue(-(563-width)/2);
    graphContianer.style.transform = 'translate3d('  + -(563-width)/2 +'px,0px,0px)';
  }
  else{
    graphContianer.style.transform = 'translate3d(' + 0 +'px,0px,0px)';
  }

}
