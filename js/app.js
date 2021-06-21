;
(function () {

    jsPlumbToolkitBrowserUI.ready(function () {


        // get a new jsPlumb Toolkit instance to use.
        var toolkit = window.toolkit = jsPlumbToolkitBrowserUI.newInstance();
        // make a random hierarchy
        var hierarchy = jsPlumbToolkitDemoSupport.randomHierarchy(3, 3);

        var controls = document.querySelector(".controls")

        //
        // create one renderer
        //
        var render = function(id, layoutParams) {
            var selector = "#demo-" + id;
            var surface = toolkit.render(document.querySelector(selector), {
                layout: layoutParams,
                events:{
                    "modeChanged" :function (mode) {
                        surface.removeClass(controls.querySelectorAll(selector + " [mode]"), "selected-mode");
                        surface.addClass(controls.querySelectorAll(selector + " [mode='" + mode + "']"), "selected-mode");
                    },
                    canvasClick: function () {
                        toolkit.clearSelection();
                    }
                },
                plugins:[
                    {
                        type:"miniview",
                        options:{
                            container:document.getElementById("miniview-" + id)
                        }
                    },
                    "lasso"
                ],
                defaults: {
                    anchor:"Continuous",
                    connector: { type:"StateMachine", options:{ curviness: 10 } },

                    endpoints: [
                        { type:"Dot", options:{ radius: 2 } },
                        { type:"Dot", options:{ radius: 2 } }
                    ],
                    endpointStyle: { fill: "#89bcde" },
                    endpointHoverStyle: { fill: "#FF6600" }
                },
                zoomToFit: true,
                consumeRightClick: false,
                dragOptions: {
                    filter: ".delete *, .add *, .delete, .add"
                }
            });

            // bind event listeners to the mode buttons
            surface.on(document.querySelector(selector), "tap", "[mode]", function (e) {
                surface.setMode(e.target.getAttribute("mode"));
            });

            // on home button tap, zoom content to fit.
            surface.on(document.querySelector(selector), "tap", "[reset]", function (e) {
                toolkit.clearSelection();
                surface.zoomToFit();
            });

            surface.bindModelEvent("tap", ".delete", function (event, target, info) {
                var selection = toolkit.selectDescendants(info.obj, true);
                toolkit.remove(selection);
            });

            surface.bindModelEvent("tap", ".add", function (event, target, info) {
                // get a random node.
                var n = jsPlumbToolkitDemoSupport.randomNode();
                // add the node to the toolkit
                var newNode = toolkit.addNode(n);
                // and add an edge for it from the current node.
                toolkit.addEdge({source: info.obj, target: newNode});
            });
        };

        //
        // renderer specs. keys are ids, values are layout params.
        //
        var rendererSpecs = {
            "hierarchical":{
                type: "Hierarchical",
                orientation: "horizontal",
                padding: [60, 60]
            },
            "circular":{
                type: "Circular",
                padding: 30
            },
            "spring":{
                type:"Spring",
                absoluteBacked:false
            },
            "balloon":{
                type:"Balloon"
            }
        };

        // render each one.
        for (var id in rendererSpecs) {
            render(id, rendererSpecs[id]);
        }

        // load the data
        toolkit.load({data: hierarchy});

        document.querySelector("#btnRegenerate").addEventListener("click", function() {
            toolkit.clear();
            toolkit.load({
                data:jsPlumbToolkitDemoSupport.randomHierarchy(3)
            });
        });

    });

})();
