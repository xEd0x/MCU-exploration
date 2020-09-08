function drawPhase(jsondata) {
    var svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var simulation = d3.forceSimulation()
    .force("link", d3.forceLink().id(function(d) {
        return d.id;
    }).distance(200))
    .force("charge", d3.forceManyBody().strength(-50))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force('collision', d3.forceCollide().radius(60));


    d3.json(jsondata, function(error, graph) {
        if (error) throw error;

        var link = svg.append("g")
            .attr("class", "links")
            .selectAll("line")
            .data(graph.links)
            .enter().append("line")
            .attr("stroke-width", function(d) {
                return Math.sqrt(d.value);
            });

        var node = svg.append("g")
            .attr("class", "nodes")
            .selectAll("image")
            .data(graph.nodes)
            .enter().append("image")
            .attr("xlink:href", function(d) { return "img/" + d.img; })
            .attr("x", -25)
            .attr("y", -25)
            .attr("width", 50)
            .attr("height", 50)
            .on("mouseenter", function (d) {
				let count = 0;
                d3.select(this)
                    .transition()
                    .attr("x", -50)
                    .attr("y", -50)
                    .attr("height", 100)
                    .attr("width", 100)

                link
                .style('stroke', function (link_d) {
                    if (link_d.source.id === d.id || link_d.target.id === d.id) {
                        count++;
                        return '#ff0000';
                    }
                    else {
                        return '#b8b8b8';
                    }
                })
                .style('stroke-width', function (link_d) { 
                    return link_d.source.id === d.id || link_d.target.id === d.id ? 2 : 1;
                })

				document.getElementById('info').innerHTML = 
					'<ul><li>' + d.name + '</li>' + 
                    '<li> connected with ' + count + ' node(s)</li>' + 
                    '</ul>';
            })
            .on("mouseleave", function (d) {
                d3.select(this)
                    .transition()
                    .attr("x", -25)
                    .attr("y", -25)
                    .attr("height", 50)
                    .attr("width", 50);
                link
                    .style('stroke', '#999')
                    .style('stroke-width', '1')
            })
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended));


        node.append("title")
            .text(function(d) {
                return d.name;
            });

        simulation
            .nodes(graph.nodes)
            .on("tick", ticked);

        simulation.force("link")
            .links(graph.links);

        function ticked() {
            link
                .attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) {
                    return d.source.y;
                })
                .attr("x2", function(d) {
                    return d.target.x;
                })
                .attr("y2", function(d) {
                    return d.target.y;
                });

            node
                .attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });
        }
    });

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}