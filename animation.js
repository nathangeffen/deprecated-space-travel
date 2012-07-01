Clock = function(clockId, time, x, y) {

    this.formattedTime = function(time) {
        
        var x =  time.getFullYear() + "-" +
            zeroFill((time.getMonth()+1),2) + "-" + 
            zeroFill(time.getDate(),2);
        return x;
    }

    this.updatePosition = function(time, x, y) {
        this.clock.setAttribute("id", clockId);
        this.clock.firstChild.nodeValue = this.formattedTime(time);
        this.clock.setAttribute("x", x);
        this.clock.setAttribute("y", y);
    };
    

    var NS="http://www.w3.org/2000/svg";
    this.clock = document.createElementNS(NS,"text");
    this.time = new Date(); 
    this.time.setTime(time.getTime());
    this.clock.setAttribute("x", x);
    this.clock.setAttribute("y", y);
    this.clock.appendChild(document.createTextNode(this.formattedTime(time)));    
}

Animation = function(parent, x_start, width) {

    this.initialize = function() {
        this.running = false;
        this.svg = document.getElementById(parent); 
        startTime = new Date();
        this.start = x_start;
        this.traveler_start = x_start;
        this.end = this.svg.getAttribute("width") - 290;
        this.initialTimeMilliseconds = startTime.getTime();
        this.clockHeight = 40;

        elem = document.getElementById("observer-clock");
        if (elem) { 
            elem.parentNode.removeChild(elem);
        }

        elem = document.getElementById("traveler-clock");
        if (elem) { 
            elem.parentNode.removeChild(elem);
        }

        this.observer = new Clock("observer-clock", startTime, this.start, this.clockHeight);
        this.svg.appendChild(this.observer.clock);

        this.traveler = new Clock("traveler-clock", startTime, this.traveler_start, 40);
        this.svg.appendChild(this.traveler.clock);
    }

    this.run  = function(distance, velocity, iterations, interval) {

        if (this.running)
            this.initialize();

        this.running = true;

        this.x_pos = 0;
        this.iterationNumber = 0;
        this.totalIterations = iterations;
        this.distance = distance;
        this.velocity = velocity;
        var timer = null;
        var a = this;
        this.timer = setInterval(function() {
            a.iterate(a);
        }, interval);
    }

    this.timeIncrement = function() {
        distance = this.iterationNumber * (this.distance / this.totalIterations);

        var observer_time = calcObserverTime(distance, 
                                             this.velocity);
        
        var traveler_time = calcTravelerTime(observer_time, 
                                             this.velocity);

        var traveler_length = calcTravelerLengthRelativeToObserver(
            1, this.velocity);

        return {"observer_time" : observer_time, 
                "traveler_time" : traveler_time,
                "traveler_length" : traveler_length};
    }

    this.iterate = function(anim) {

        ++anim.iterationNumber;
        anim.x_pos = anim.iterationNumber * 
            (anim.end - anim.start) / anim.totalIterations +anim.traveler_start;

        var time_increments = anim.timeIncrement();

        if (anim.iterationNumber >= anim.totalIterations) {
            time_increments["traveler_length"] = 1;
            clearInterval(anim.timer);
        }

        anim.observer.time.setTime(
            time_increments["observer_time"] * 1000 + 
                anim.initialTimeMilliseconds);

        anim.traveler.time.setTime(
            time_increments["traveler_time"] * 1000 +
                anim.initialTimeMilliseconds);

        anim.observer.updatePosition(anim.observer.time,
                                     anim.start, anim.clockHeight); 


        anim.traveler.updatePosition(anim.traveler.time,
                                         anim.x_pos, anim.clockHeight);
        
        document.getElementById("rocket").setAttribute("x", anim.x_pos);
        document.getElementById("rocket-g").
            setAttribute("transform", "scale(" 
                         + time_increments["traveler_length"] + ", 1)");
    }

}


function zeroFill( integer, width )
{
  width -= integer.toString().length;
  if ( width > 0 )
  {
    return new Array(width + 1).join('0') + integer;
  }
  return integer + ""; // always return a string
}

