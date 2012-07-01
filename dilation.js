/* 
   Learn computer science example.
   
   This file implements the Traveler class. It manages the time and
   length dilation form and calculates time and length dilations.
*/

/* Constants of speed and distance. */
SPEED_OF_LIGHT = 299792458;
SPEED_OF_LIGHT_SQUARED = 89875517873681760;
ASTRONOMICAL_UNIT = 149598000000;
LIGHT_MINUTE = 17987547480;
LIGHT_YEAR = 9460730472580800;
PARSEC = 30856780000000000;

function Traveler(form) {
    this.fields = {
        distance : 
        {
            lbl :  "Distance",
            value : "",
            calc: Traveler.prototype.calcDistance,
            units: 
            {
                "meters": 1, 
                "kilometers": 1000, 
                "light-seconds": SPEED_OF_LIGHT, 
                "light-minutes": LIGHT_MINUTE,
                "astronomical unit" : ASTRONOMICAL_UNIT,
                "light-years": LIGHT_YEAR,
                "parsec" : PARSEC
            },
            ajaxValues : true,
            changed : false,
            primary : true,
            min_val : 0.00000000000000001,
            min_error : "Distance too small."
        },
        velocity : 
        {
            lbl : "Velocity",
            value : "",
            calc : Traveler.prototype.calcVelocity,
            units : 
            {
                "kilometers per hour" : 0.27777777777777777777,
                "meters per second" : 1,
                "kilometers per second" : 1000,
                "speed of light" : SPEED_OF_LIGHT
            },
            ajaxValues : true,
            changed : false,
            primary : true,
            min_val : 0.000000000000001,
            min_error : "Velocity too small.",
            max_val : SPEED_OF_LIGHT - 0.001,
            max_error : "Velocity must be less the speed of light."
        },
        traveler_time : 
        {
            lbl : "Traveler time elapsed",
            value : "",
            calc : Traveler.prototype.calcTravelerTime,
            units : 
            {
                "seconds" : 1,
                "minutes" : 60,
                "hours" : 3600,
                "days" : 86400,
                "months" : 2629800,
                "years" : 31557600
            },
            changed : false,
            primary : false
        },
        observer_time : 
        {
            lbl : "Observer time elapsed",
            value : "",
            calc : Traveler.prototype.calcObserverTime,
            units : 
            {
                "seconds" : 1,
                "minutes" : 60,
                "hours" : 3600,
                "days" : 86400,
                "months" : 2629800,
                "years" : 31557600
            },
            changed : false,
            primary : false
        },
        traveler_length : 
        {
            lbl : "Traveler length relative to traveler",
            value : "",
            calc : Traveler.prototype.calcTravelerLength,
            units : 
            {
                "meters" : 1,
                "millimeters" : 1/100,
                "centimeters" : 1/10,
                "kilometers" : 1000
            },
            changed : false,
            primary : true,
            def_val : 1
        },
        observer_length : 
        {
            lbl : "Traveler length relative to observer",
            value : "",
            calc : Traveler.prototype.calcObserverLength,
            units : 
            {
                "meters" : 1,
                "millimeters" : 1/100,
                "centimeters" : 1/10,
                "kilometers" : 1000
            },
            changed : false,
            primary : false
        }
    };
    
    for (field in this.fields) {
        for (unit in this.fields[field].units) {
            if (this.fields[field].units[unit] == 1) {
                this.fields[field].current_unit = unit;
                break;
            }
        }
    }
    this.num_undefined = 0;
};


/* Calculation functions */

Traveler.prototype.calcDistance = function(t) {
    return t.fields.velocity.value * t.fields.observer_time.value || "";
};

Traveler.prototype.calcVelocity = function(t) {
    if ( t.fields.observer_time.value && t.fields.distance.value ) {
        return t.fields.distance.value / t.fields.observer_time.value;
    } else {
        return "";
    }
};

calcTravelerTime = function(observerTime, velocity)
{
    return observerTime * 
            Math.sqrt(1 - Math.pow(velocity, 2) / 
                      SPEED_OF_LIGHT_SQUARED);    
}

Traveler.prototype.calcTravelerTime  = function(t) {
    if (t.fields.observer_time.value && t.fields.velocity.value) {
        return calcTravelerTime(t.fields.observer_time.value,
                                t.fields.velocity.value);
    } else {
        return "";
    }
};

calcObserverTime = function(distance, velocity) 
{
    return distance / velocity;
}

Traveler.prototype.calcObserverTime = function(t) {
    if (t.fields.distance.value && t.fields.velocity.value) {
        return calcObserverTime(t.fields.distance.value, t.fields.velocity.value);
    } else {
        return "";
    }
};

calcTravelerLengthRelativeToObserver = function(length, velocity) {
    return length * Math.sqrt(1 - Math.pow(velocity, 2) / 
                      SPEED_OF_LIGHT_SQUARED)
}

Traveler.prototype.calcTravelerLength = function(t) {
    if (t.fields.observer_length.value && t.fields.velocity.value) {
        return t.fields.observer_length.value / 
            Math.sqrt(1 - Math.pow(t.fields.velocity.value, 2) / 
                      SPEED_OF_LIGHT_SQUARED) || "";
    } else {
        return "";
    }
};

Traveler.prototype.calcObserverLength = function(t) {
    if (t.fields.traveler_length.value && t.fields.velocity.value) {
        return calcTravelerLengthRelativeToObserver(
            t.fields.traveler_length.value, t.fields.velocity.value);
    } else {
        return "";
    }
};

/* The processInput function gets the values of all the fields and 
   determines how many have not been set. 
*/

Traveler.prototype.processInput = function() {
    clearErrorMessage();
    this.num_undefined = 0;
    
    for (field in this.fields) {
        if (document.getElementById(field).value) {
            this.fields[field].value = 
            document.getElementById(field).value 
                * this.fields[field].units[this.fields[field].current_unit];

            if (this.fields[field].hasOwnProperty('max_val') &&
                this.fields[field].value > this.fields[field].max_val) {
                if (this.fields[field].hasOwnProperty('max_error')) {
                    throw(this.fields[field].max_error);
                }
            }
            if (this.fields[field].hasOwnProperty('min_val') &&
                this.fields[field].value < this.fields[field].min_val) {
                if (this.fields[field].hasOwnProperty('min_error')) {
                    throw(this.fields[field].min_error);
                }
            }

        } else {
            this.fields[field].value = "";
            ++this.num_undefined;
        };
    };
};

/* The processOutput function creates the traveler form fields and sets 
   them to there calculated values. 
*/

Traveler.prototype.processOutput = function() {

    var html_snippet = "";

    for (field in this.fields) {
       
        if (this.fields[field].value == "") {
            if (this.fields[field].hasOwnProperty('def_val')) {
                this.fields[field].value = this.fields[field].def_val;
                value = this.fields[field].def_val;
            } 
            else {
                value = "";
            }
        } else {
            value = this.fields[field].value  
                / this.fields[field].units[this.fields[field].current_unit];
        }

        html_snippet  += '<label for="' 
            + field + '">' + this.fields[field].lbl + '</label>'
            + '<div class="widget">' 
            + '<input id="' + field +'" type="text" value="' 
            + value + '" '
            + 'onchange="Traveler.prototype.setChanged(this, traveler)"'
            + 'onkeyup="Traveler.prototype.keyup(this, traveler)"'
            + '></input>';

        html_snippet += '<select id="' + field + '-units"' + 
            'onchange="Traveler.prototype.updateMetric(this, traveler)"' + '>';
        for (unit in this.fields[field].units) {
            html_snippet += '<option ';
            if(this.fields[field].current_unit == unit) {
                html_snippet += 'selected="selected"';
            }
            html_snippet += '>' + unit + '</option>';
        }
        html_snippet += "</select></div>";
        document.getElementById("flds").innerHTML = html_snippet;
    }
    for (field in this.fields) 
        this.fields[field].changed = false;
    document.forms[0].elements[0].focus();
};


/* The calculate function gets all the input values and then
   calls the calculation function for the undefined or unchanged
   secondary fields. It iterates over the fields twice in case a 
   calculation on the first iteration of field x makes it possible 
   for field y to be calculated on the second iteration.
*/
Traveler.prototype.calculate = function() {
    try {
        this.processInput();

        if (this.num_undefined > 4) {
            throw("You must enter the values of at least two variables.");
        } else {
            for (var i = 0; i < 2; i++) {
                for (f in this.fields) {
                    try {
                        if (!this.fields[f].value || 
                            (!this.fields[f].changed && !this.fields[f].primary) ) {
                            this.fields[f].value = this.fields[f].calc(this);
                        };
                    } catch(e) {
                        continue;
                    };
                };
            };
            this.processOutput();
        };
    } catch(e) {
        setErrorMessage(e);
    }
};

/*
  Called on onChange event for the form fields. Sets an indicator that
  the field has been changed.
*/
Traveler.prototype.setChanged = function(e, t) {
    t.fields[e.id].changed = true; 
}

/*
  Called on keyup of any field. If an onkeyup function exists for the
  field, it is invoked here.
*/

Traveler.prototype.keyup = function(e, t) {
    if (t.fields[e.id].ajaxValues) {
        Traveler.prototype.showFieldValues(e.value, t, e.id);
    }
}

/*
  This function implements an AJAX call to the server to allow the user
  to select values for the current field. 
*/

Traveler.prototype.showFieldValues = function(str, t, id) {
    var options = [];
    var alpha = /^([a-zA-Z ]+)/;

    if (alpha.test(str)==true) {
        if (window.XMLHttpRequest) {
            xmlhttp=new XMLHttpRequest();
        } else {
            return;
        }

        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState==4 && xmlhttp.status==200)
            {
                options = JSON.parse(xmlhttp.responseText);
                $( "#" +id ).autocomplete({ 
                    minLength: 0,
                    delay: 20,
                    select: function(event, ui) { 
                        unit = t.fields[id].current_unit;
                        denominator = t.fields[id].units[unit];
                        ui.item.value = ui.item.value / denominator;
                    },
		            source: options
	            });
            }
        };

        xmlhttp.open("GET","index.php?field=" + id +"&value="+str,true);
        xmlhttp.send();            
    };
}

/*
  This function is called when the user changes the metric of a form
  field. It recalculates the field's value.
*/

Traveler.prototype.updateMetric = function(e, t) {
    field = e.id.substring(0, e.id.lastIndexOf("-unit"));
    value = document.getElementById(field).value; 
    oldUnit = t.fields[field].current_unit; 
    t.fields[field].current_unit = e.value;

    if (value) {
        oldUnitValue = t.fields[field].units[oldUnit];
        newUnitValue = t.fields[field].units[e.value];
        document.getElementById(field).value = value * 
            oldUnitValue / newUnitValue;
    }
};


Traveler.prototype.animate = function() {
    var currentTime = new Date();
    currentTime.setTime(currentTime.getTime()+1000000000*1000);
    document.getElementById("clock1").firstChild.nodeValue = 
        currentTime.getFullYear() + "-" + 
        zeroPad(currentTime.getMonth(), 2) + "-" +
        zeroPad(currentTime.getDay(), 2) + "-" +
        zeroPad(currentTime.getHours(), 2) + ":" + 
        zeroPad(currentTime.getMinutes(), 2) + ":" +
        zeroPad(currentTime.getSeconds(), 2);
}

/*
  Puts an error message in the error id selector.
*/
setErrorMessage = function(str) 
{
    document.getElementById("error").innerHTML += "<p>" + str + "</p>";
};

/*
  Removes all error messages in the error id selector.
*/

clearErrorMessage = function(str)
{
    document.getElementById("error").innerHTML = "";
}


function isNumber(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

