var animation = new Animation('svg-viewer', 0, 800);
var traveler = new Traveler();

runAnimation = function()
{
    clearErrorMessage();
    
    iterations = document.getElementById('iterations').value;

    if (!isNumber(iterations) || 
        !(iterations > 0 && iterations < 2000)) 
        iterations = 200;

    milliseconds = document.getElementById('milliseconds').value;

    if (!isNumber(milliseconds) || 
        !(milliseconds > 0 && milliseconds < 2000)) 
        milliseconds = 50;
    
    if (traveler.fields['distance'].value && 
        traveler.fields['velocity'].value) {
        animation.run(traveler.fields['distance'].value, 
                      traveler.fields['velocity'].value,
                      iterations,
                      milliseconds);
    } else {
        setErrorMessage("Please first calculate or set the distance and velocity.");
    }
}

calculate = function()
{
    traveler.calculate();
    if (traveler.fields['distance'].value && 
        traveler.fields['velocity'].value) {
        document.getElementById("animate-button").disabled = false;
    } else {
        document.getElementById("animate-button").disabled = true;
    }
}

clear = function()
{
    traveler.clear();
    document.getElementById("animate-button").disabled = true;
}

window.onload = function() {
    animation.initialize();
    traveler.processOutput();
};

