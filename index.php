<?php

/*
  This section of the PHP code is executed upon a GET query on 
  autocompletion of the distance field. It gets values from the 
  database matching the query and returns them in JSON format.
*/
if(isset($_GET["field"]) && !empty($_GET["field"]) &&
   isset($_GET["value"]) && !empty($_GET["value"])) {

  echo '[';
  $db = new SQLite3('dilation.sqlite');
  if ($db) {
    $value=htmlspecialchars($_GET["value"]);
    
    if ($_GET["field"]=="distance") {
      $qry = "SELECT * FROM distances WHERE place LIKE '" . SQLite3::escapeString ($value) . "%'" . 'ORDER BY place';
    } else {
      $qry = "SELECT * FROM velocities WHERE object LIKE '" . SQLite3::escapeString ($value) . "%'" . 'ORDER BY object';
    }

    $results = $db->query($qry);


    $i = 0;
    while($row = $results->fetchArray()) {
      if ($i > 0) {
        echo ', ';
      }
      $i = $i + 1;
      echo '{';
      echo '"label" : "';
      echo $row[0];
      echo '", ';
      echo '"value" : "';
      echo $row[1];
      echo '"';
      echo '}';
    }
    $db->close();
  }
  echo ']';
  return;
}
?>

<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8">
<meta content="relativity, Einstein, time dilation, length dilation" name="keywords">
<meta content="Time and length dilation calculator" name="description">
<link rel="icon" href="favicon.ico" type="image/x-icon" />
<link rel="shortcut icon" href="favicon.ico" type="image/x-icon" />
<link type="text/css" href="dilation.css" rel="stylesheet">
<title>Time and length dilation calculator</title> 

<link type="text/css" href="css/ui-lightness/jquery-ui-1.8.20.custom.css" rel="Stylesheet" />	

<!--Javascript sources-->
<script type="text/javascript" src="js/jquery-1.7.2.min.js"></script>
<script type="text/javascript" src="js/jquery-ui-1.8.20.custom.min.js"></script>
<script type="text/javascript" src="dilation.js"></script>
<script type="text/javascript" src="animation.js"></script>
<script type="text/javascript" src="startup.js"></script>

</head>

<body>


<div id="banner">
<h1 id="main_heading">Time and length dilation calculator</h1>

</div>

<div id="content">

<p>Use this calculator to see the effects of special relativity on time and length from the perspective of a traveler and an observer.</p>

<p>Enter any two variables and the calculator will determine as many of the other variables as possible.</p>

<div id="traveler-form">

<form name="time_dilation" class="formstyle">

<div id="error"></div>

<div id="flds">

</div>

<button onclick="calculate()" title="Calculate" type="button" 
  title="Calculate unfilled fields">Calculate</button>

</form>



</div>

<div id="animation">

<svg xmlns="http://www.w3.org/2000/svg" id="svg-viewer" xmlns:xlink="http://www.w3.org/1999/xlink" width="680" height="160">

  <svg id="observer" x="0" y="55">

  <g
     inkscape:label="Layer 1"
     inkscape:groupmode="layer"
     id="layer1">
    <path
       sodipodi:type="arc"
       style="fill:#32281a;fill-opacity:0.90873012"
       id="path6822"
       sodipodi:cx="205.71428"
       sodipodi:cy="426.64789"
       sodipodi:rx="28.571428"
       sodipodi:ry="20"
       d="m 234.28571,426.64789 a 28.571428,20 0 1 1 -57.14286,0 28.571428,20 0 1 1 57.14286,0 z"
       transform="matrix(0.25,0,0,0.25,9.285714,-72.481984)" />
    <path
       sodipodi:type="arc"
       style="opacity:0.2408759;fill:#32281a;fill-opacity:0.5"
       id="path6830"
       sodipodi:cx="120"
       sodipodi:cy="455.21933"
       sodipodi:rx="117.14286"
       sodipodi:ry="134.28572"
       d="m 237.14286,455.21933 a 117.14286,134.28572 0 1 1 -234.2857204,0 117.14286,134.28572 0 1 1 234.2857204,0 z"
       transform="matrix(0.25,0,0,0.25,12.857142,-66.053412)" />
    <path
       style="fill:none;stroke:#000000;stroke-width:0.25px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="m 51.42857,59.179991 18.57143,0"
       id="path6834"
       inkscape:connector-curvature="0" />
    <text x="20" y="50" font-size="10px">Observer</text>
  </g>

  </svg>

  <svg id="rocket" x="70" y="70">
  
  <g id="rocket-g">
    <path
       style="fill:#0000ff"
       d="m 96.153866,17.326374 c 0.0687,-1.3259 0.22338,-2.41072 0.3437,-2.41072 0.18462,0 10.596404,5.32455 21.799634,11.14827 1.61914,0.84167 2.94503,1.63149 2.94643,1.75517 0.002,0.12368 -2.5287,1.72626 -5.62245,3.56129 -3.09375,1.83503 -8.73791,5.30973 -12.54257,7.72156 -3.804664,2.41183 -6.978774,4.38514 -7.053574,4.38514 -0.16228,0 -0.0505,-22.70078 0.12883,-26.16071 z"
       id="path2997"
        />
    <rect
       style="fill:#ff00ff"
       id="rect2999"
       width="29.285713"
       height="53.214287"
       x="14.54065"
       y="-96.317619"
       fill-opacity="0.3"
       transform="matrix(0,1,-1,0,0,0)" />
    <path
       style="fill:#00ff00"
       d="m 4.3711757,3.0020333 c 0.7366,-0.121755 5.9503203,-0.22314 11.5860403,-0.225302 l 10.24675,-0.0039 8.41396,5.956992 8.41396,5.9569857 -0.0134,14.48944 -0.0134,14.48944 -7.34534,5.3135 -7.34534,5.3135 -12.01628,0.17856 c -6.6089603,0.0982 -11.9359203,0.096 -11.8377103,-0.005 0.8555,-0.87908 20.1549003,-16.33634 20.3969803,-16.33634 0.17735,0 0.3173,-4.37274 0.3173,-9.9144 l 0,-9.9144 -11.07143,-7.475368 C 8.0139757,6.7142913 3.0318357,3.3218013 3.0318357,3.2868733 c 0,-0.03493 0.60268,-0.16312 1.33929,-0.284872 z"
       id="path3003"
       />
    <path
       style="fill:none;stroke:#000000;stroke-width:1px;stroke-linecap:butt;stroke-linejoin:miter;stroke-opacity:1"
       d="m 365.71429,960.93361 0,-5.71428"
       id="path3007"
        />
    <text
       x="46"
       y="35"
       font-size="10px">Traveler
    </text>
  </g>

  </svg>

  <svg id="destination" x="540" y="54">
  <text x="74" y="50" font-size="10px">Destination</text>
  <circle cx="100" cy="46" r="35" stroke="black"
  stroke-width="2" fill="red" fill-opacity="0.1" />
  </svg>

</svg>

<form>
<button id="animate-button" onclick="runAnimation()" type="button"
  disabled="true" title="Run animation">
Run
  </button>&nbsp;
<label for="iterations">Iterations&nbsp;</label>
<input id="iterations" type="text" value="200" maxlength="4" size="4" /></input>

  <label for="milliseconds">Milliseconds&nbsp;</label>
<input id="milliseconds" type="text" value="50" maxlength="4" size="4" />

</form>
</div>

</div>



</body>
</html>
