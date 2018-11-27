(function () {
    var width = 500, height = 500;

    // allocate space
    var svg = d3.select("#chart")
        .append("svg")
        .attr("height", height)
        .attr("width", width)
        .append("g")
        .attr("transform", "translate(0,0)");

    //image pattern defs
    var defs=svg.append("defs");
    defs.append("pattern")
        .attr("id","qiman")
        .attr("height","100%")
        .attr("width","100%")
        .attr("patternContentUnits","objectBoundingBox")
        .append("image")
        .attr("height",1)
        .attr("width",1)
        .attr("preserveAspectRatio","none")
        .attr("xlns:xlink","http://www.w3.org/1999/xlink")
        .attr("xlink:href","images/andrew.png")


    //scaler
    var radiusSacle = d3.scaleSqrt().domain([100, 300]).range([10, 80])


    // we need simulation for force
    //a collection of forces
    //1.move to center
    //2. not collide
    var simulation = d3.forceSimulation()
        .force("x", d3.forceX(width / 2).strength(0.05))
        .force("y", d3.forceY(height / 2).strength(0.05))
        .force("collide", d3.forceCollide( function(d){
          return radiusSacle(d.sales)+1
        }))

    // read data
    d3.queue()
        .defer(d3.csv, "sales.csv")
        .await(ready)


    function ready(error, datapoints) {

        var circles = svg.selectAll(".artist")
            .data(datapoints)
            .enter().append("circle")
            .attr("class", "artist")
            .attr("r", function (d) {
                return radiusSacle(d.sales)
            })
            .attr("fill", "url(#qiman)")
            .on('click', function (d) {
                console.log(d)
            })

        simulation.nodes(datapoints)
            .on('tick', ticked)

        // update every second
        function ticked() {
            circles
                .attr("cx", function (d) {
                    return d.x
                })
                .attr("cy", function (d) {
                    return d.y
                })
        }
    }
})();