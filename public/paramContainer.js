//const div = d3.selectAll("graphParams");

var margin = { top: 5, right: 5, bottom: 5, left: 5 },
    width = 125 - margin.left - margin.right,
    height = 50 - margin.top - margin.bottom;

var svg = d3.select('#graphParams')
    .append('svg')
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.left + margin.right)
    .append('g')
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

var xMin = 0,
    xMax = 10;

//get data need a function to get param
var data = [];

export function update(uVar, t) {
    for (let v in uVar) {
        var dataPoint = {
            time: t/100,
            type: v,
            val: uVar[v][0],
        }
        data.push(dataPoint)
    }
    let numOfV = 4 //Object.keys(uVar).length
    while (data.length > 10 * numOfV) {
        data.shift()
    }
    if (data.length === 10*numOfV){
        xMax++
        xMin++
    }

    makeGraph()
}

export function makeGraph() { //input data
    var audioDur = document.querySelector("audio").duration

    var sumstat = d3.nest()
        .key(function (d) { return d.type })
        .entries(data);

        //console.log(sumstat)
    var res = sumstat.map(function (d) { return d.type }) // list of group names
    var color = d3.scaleOrdinal()
        .domain(res)
        .range(['#e41a1c', '#377eb8', '#4daf4a', '#984ea3'])


    // adding axis
    var x = d3.scaleTime()
        .domain([xMin, xMax])
        .range([0, width]);
    svg.append('g')
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10));

    var y = d3.scaleLinear()
        .domain([0, 1]) //update if bounds are above
        .range([height, 0]);
    svg.append('g')
        .call(d3.axisLeft(y));
    
    d3.selectAll("path.line").remove();

    svg.selectAll('.line')
        .data(sumstat)
        .enter() 
        .append("path")
        .attr('class', 'line')
        .attr('fill', 'none')
        .attr("stroke", function(d){ return color(d.key) })
        .attr('stroke-width', 1)
        .attr('d', function(d){
            return d3.line()
            .x(function(d){ return x(d.time) })
            .y(function(d){ return y(d.val) })
            (d.values)
            });
}