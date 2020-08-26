
var browser = null;
var map = null;
var renderer = null;
var mercuryFeatures = null;
var mercuryFeaturesInitialized = false;
var labelState = null;
var clickCoords = null;
var clickPhysCoords = null;
var clickElevation = 0;

function startDemo(onMapPositionChanged) {
	if (window.innerWidth < 850 || window.innerHeight < 600) {
		onStart();
	}

    var browserConfig = {
        //map : "{{ site.cdn_host }}/mario/store/mercury-provisional/map-config/melown/mercury-messenger/mapConfig.json",
        map : "//cdn.melown.com/mario/store/mercury-provisional/map-config/melown/mercury-messenger/mapConfig.json",
        pos : ["obj",0,0,"float",0.00,0,-90,0.00,5091094.77,55.00],
        view : {
            "surfaces": { "melown-mercury-dem": ["mercury-natural-color"] },
            "freeLayers": {}
        },
        controlLogo : false,
        controlSpace : false,    
        navigationMode : "free"
        , positionInUrl: true
    };
    vtsParseUrlParams(browserConfig, window.parent ?  window.parent.location.href : null);

    browser = vts.browser("map-div", browserConfig);

    //callback once is map config loaded
    browser.on("map-loaded", onMapLoaded);

    browser.on("map-update", onMapUpdate);

    if(onMapPositionChanged){
        browser.on("map-position-changed", onMapPositionChanged);
    }

    //add mouse down callback
    browser.ui.getMapElement().on('mouseup', onMouseUp);
    browser.ui.getMapElement().on('dragend', onMouseUp);
    
    renderer = browser.renderer;

    labelState = renderer.createState({"zequal":false, "ztest":false});
    
    vts.utils.loadJSON('./resources/mercury.geojson', onGeoJsonLoaded);
}

function onGeoJsonLoaded(data_) {
    mercuryFeatures = (data_ && data_["features"]) ? data_["features"] : null; 

    if (map) {
        //force map redraw
        map.redraw();
    }
}

function onMapUpdate(event) {
    if (!map) {
        return;
    }

    if (clickCoords) {
        var res = map.getSurfaceHeight(clickCoords, 1000);
        var elevation = res[0].toFixed(0); 
        
        if (elevation != clickElevation) {
            document.getElementById("info-elevation").innerHTML = "Elevation: " + elevation + " m"; 
        }                                 
    }
};

function onMouseUp(event) {
    if (!map) {
        return;
    }

    var button = event.getMouseButton() == "left";
    
    var draggingState = browser.ui.getMapElement().getDraggingState();

    if (event.getMouseButton() == "left" ||
        (event.getType() == "dragend" && event.getDragButton("left"))) {  //"none" is used for touch

        var moved_ = browser.ui.getMapElement().getDraggingState()["absMoved"];
        if ((moved_[0] + moved_[1]) < 10) {
            var coords = event.getMouseCoords();

            //get hit coords with fixed height
            clickCoords = map.getHitCoords(coords[0], coords[1], "fixed");

            var physicalSrs = map.getReferenceFrame()["physicalSrs"]; 
            var navigationSrs = map.getReferenceFrame()["navigationSrs"]; 

            //convet nav coords to geocent coords
            clickPhysCoords = map.convertCoords(navigationSrs, physicalSrs, clickCoords);
            

            var element = document.getElementById("info-panel-text");
                                
            var res = map.getSurfaceHeight(clickCoords, 1000);                                 

            element.innerHTML = "<h3 id='info-elevation'>Elevation: " + clickCoords[2].toFixed(0) + " m</h3>"+
                                 "<h4>Planetocentric: " + clickCoords[0].toFixed(3) + "&deg;, " + clickCoords[1].toFixed(3) + "&deg;</h4>" +
                                 "<h4>Cartesian: " + clickPhysCoords[0].toFixed(0) + ", " + clickPhysCoords[1].toFixed(0) + ", " + clickPhysCoords[2].toFixed(0) + "</h4>";
            
            //force map redraw to display hit point
            map.redraw();
        }
    }
}


function initMercuryFeatures() {
    for (var i = 0, li = mercuryFeatures.length; i < li; i++) {
        var feature = mercuryFeatures[i];
        
        var geometry = feature["geometry"]; 
        var properties = feature["properties"]; 
       
        var physicalSrs = map.getReferenceFrame()["physicalSrs"]; 
        var navigationSrs = map.getReferenceFrame()["navigationSrs"]; 
        
        
        if (properties && geometry && geometry["type"] == "Point") {
            var coords = [geometry["coordinates"][0], geometry["coordinates"][1], 10];
            geometry["coords"] = coords;

            //convet nav coords to geocent coords
            var physCoords = map.convertCoords(navigationSrs, physicalSrs, coords);

            geometry["physCoords"] = physCoords; 
            
            //we use gecent coords as normal and normalize normal vector
            var normal = [0,0,0];
            vts.vec3.normalize(physCoords, normal);
            
            geometry["normal"] = normal; 
            
            properties["diameter-label"] = Math.max(20, properties["diameter"]);
        }
    }
    
    mercuryFeaturesInitialized = true;
}

function onStart() {
    document.getElementById("welcome-page").style.display = "none"; 
}


function onMapLoaded() {
    map = browser.map;

    //add render slots
    //render slots are called during map render
    map.addRenderSlot("custom-meshes", onDrawLabels, true);
    //browser.moveRenderSlotAfter("after-map-render", "custom-meshes");
}

function onLayerButton(index) {
    if (!map) {
        return;
    }

    document.getElementById("layers-title4-selected").style.display = "none";
    document.getElementById("layers-title3-selected").style.display = "none";
    document.getElementById("layers-title2-selected").style.display = "none";
    document.getElementById("layers-title1-selected").style.display = "none";
    
    switch(index) {
        case 0: document.getElementById("layers-title1-selected").style.display = "block";
                //map.setView("Enhanced Color");
                map.setView({"surfaces": { "melown-mercury-dem": ["mercury-enhanced-color"] }, "freeLayers": {}});
                ga('send', 'pageview', '/mercury/enhanced-colors');
                break; 
        case 1: document.getElementById("layers-title2-selected").style.display = "block";
                //map.setView("False Color");
                map.setView({"surfaces": { "melown-mercury-dem": ["mercury-false-color"] }, "freeLayers": {}});
                ga('send', 'pageview', '/mercury/false-colors');
                break; 
        case 2: document.getElementById("layers-title3-selected").style.display = "block";
                //map.setView("Morphology");
                map.setView({"surfaces": { "melown-mercury-dem": ["mercury-morphology"] }, "freeLayers": {}});
                ga('send', 'pageview', '/mercury/morphology');
                break; 
        case 3: document.getElementById("layers-title4-selected").style.display = "block";
                //map.setView("Natural Color");
                map.setView({"surfaces": { "melown-mercury-dem": ["mercury-natural-color"] }, "freeLayers": {}});
                ga('send', 'pageview', '/mercury/natural-color');
                break; 
    }
	
   document.getElementById('layers-panel').style.animationName = 'hidepanel';                            
}

function onLayerButtonHover(index) {
    if (vts.platform.isMobile()) {
        return;
    }

	if (window.innerWidth < 850 || window.innerHeight < 600) {
		return;
	}
	
    switch(index) {
        case 0: document.getElementById("layers-title1-text").style.display = "block"; break; 
        case 1: document.getElementById("layers-title2-text").style.display = "block"; break; 
        case 2: document.getElementById("layers-title3-text").style.display = "block"; break; 
        case 3: document.getElementById("layers-title4-text").style.display = "block"; break; 
    }
}

function onLayerButtonLeave(index) {
    if (vts.platform.isMobile()) {
        return;
    }

	if (window.innerWidth < 850 || window.innerHeight < 600) {
		return;
	}

    switch(index) {
        case 0: document.getElementById("layers-title1-text").style.display = "none"; break; 
        case 1: document.getElementById("layers-title2-text").style.display = "none"; break; 
        case 2: document.getElementById("layers-title3-text").style.display = "none"; break; 
        case 3: document.getElementById("layers-title4-text").style.display = "none"; break; 
    }
}

function isPointVisible(physCoords, camPos, planetRadius, navigationSrs, physicalSrs, tolerance) {

    //var physCoords = browser.convertCoords(navigationSrs, physicalSrs, pointPos_);
    //var camCoords_ = browser.convertCoordsFromNavToCameraSpace(pointPos_, "fixed");
        
    if (map.isPointInsideCameraFrustum(physCoords)) {

        var coords = map.convertCoordsFromPhysToCanvas(physCoords);
       
        if (coords[2] > 0) {
            
            //get ray form camera to label
            var ray = [physCoords[0] - camPos[0],
                        physCoords[1] - camPos[1],
                        physCoords[2] - camPos[2]];

            ray = vts.vec3.normalize(ray);
            

            var offset = [camPos[0], camPos[1], camPos[2]];
            var a = vts.vec3.dot(ray, ray);
            var b = 2 * vts.vec3.dot(ray, offset);
            var c = vts.vec3.dot(offset, offset) - planetRadius * planetRadius;
            var d = b * b - 4 * a * c;
            
            if (d > 0) {
                
                d = Math.sqrt(d);
                
                var t1 = (-b - d) / (2*a);
                var t2 = (-b + d) / (2*a);
                
                if (t1 > t2) {
                    var t = t1;
                    t1 = t2;
                    t2 = t1;
                }
                
                var p1 = [camPos[0] + ray[0] * t1,
                          camPos[1] + ray[1] * t1,
                          camPos[2] + ray[2] * t1];


                var dist = [p1[0] - physCoords[0],
                            p1[1] - physCoords[1],
                            p1[2] - physCoords[2]];
                
                if (vts.vec3.length(dist) < tolerance) {
                    return [true, coords];
                }
            }
        }
    }

    return [false, coords];
}

function onDrawLabels(renderChannel) {
    if (renderChannel != "base") {
        return; //draw only in base channel
    }
    
    if (!mercuryFeatures) {
        return;
    }

    if (!mercuryFeaturesInitialized) {
        initMercuryFeatures();
    }
    
    var pos = map.getPosition();
    var viewExtent =  pos.getViewExtent() * 0.001; //in kilometers

    var physicalSrs = map.getReferenceFrame().physicalSrs; 
    var navigationSrs = map.getReferenceFrame().navigationSrs; 

    var cameraInfo = map.getCameraInfo();
    var camPos = cameraInfo.position;
    var camDir = cameraInfo.vector;
    
    //get position normal    
    //convet nav coords to geocent coords
    var normal = map.convertCoords(navigationSrs, physicalSrs, pos.getCoords());
    
    //we use gecent coords as normal and normalize normal vector
    vts.vec3.normalize(normal);
    
    var mercuryRadius = map.getSrsInfo(navigationSrs).a;
 
    renderer.setState(labelState);

    for (var i = 0, li = mercuryFeatures.length; i < li; i++) {
        var feature = mercuryFeatures[i];
        
        var geometry = feature["geometry"]; 
        var properties = feature["properties"]; 
        
        if (properties && geometry && geometry["type"] == "Point") {
            
            if (properties["diameter-label"] > viewExtent*0.05 &&
                properties["diameter-label"] < viewExtent*0.99) {
               
                var res = isPointVisible(geometry["physCoords"], camPos, mercuryRadius, navigationSrs, physicalSrs, 2000);

                if (res[0]) {
                    var coords = res[1];
                    renderer.drawDebugText({"coords":coords, "depth":coords[2], "text" : properties["clean_name"],
                                            "size":8, "align": "center", "color":[255,255,0,255], "useState": true});
                }   
            }
        } 
    }
    
    if (clickCoords) { //draw hit point
        //conver hit coords to canvas coords
        coords = map.convertCoordsFromPhysToCanvas(clickPhysCoords);

        var res = isPointVisible(clickPhysCoords, camPos, mercuryRadius, navigationSrs, physicalSrs, 20000);
        
        var element = document.getElementById("info-panel");
 
        if (res[0]) {
           
            element.style.display = "block";
            element.style.left = coords[0] + "px";
            element.style.top = coords[1] + "px";
            
            var coords = res[1];
        } else {
            element.style.display = "none";
        }
    }    
} 

function buttonClicked() {
   document.getElementById('layers-panel').style.animationName = 'showpanel';
}


