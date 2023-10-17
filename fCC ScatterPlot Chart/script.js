let url ="https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
let req = new XMLHttpRequest()

let dataset = []

let xScale
let yScale

let w = 800;
let h = 600;
let padding = 40;

let svg = d3.select('svg')
let tooltip = d3.select('#tooltip')

let drawCanvas = () => {
   svg.attr('width', w)
   svg.attr('height', h);
}

let generateScales = () => {
      xScale = d3.scaleLinear() 
                  .domain([d3.min(dataset, (item) => {
                     return item['Year']
                  }) - 1, d3.max(dataset, (item) => {
                     return item['Year']
                  }) + 1])
                  .range([padding, w - padding]);

      yScale = d3.scaleLinear()
                  .domain([d3.min(dataset, (item) => {
                     return new Date(item['Seconds'] * 1000)
                  }), d3.max(dataset, (item) => {
                     return new Date(item['Seconds'] * 1000)
                  })])
                  .range([h - padding, padding]);
}

let drawPoint = () => {

   svg.selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle')
      .attr('class','dot')
      .attr('r', 8)
      .attr('data-xvalue', (item) =>{
         return item['Year']
      })
      .attr('data-yvalue', (item) =>{
         return new Date(item['Seconds'] * 1000)
      })
      .attr('cx', (item) => {
         return xScale(item['Year'])
      })
      .attr('cy', (item) => {
         return yScale(new Date(item['Seconds']) * 1000)
      })
      .attr('fill', (item) => {
         if(item['Doping'] != ''){
            return 'orange'
         }else {
            return 'white'
         }
      })
      .on('mouseover', (item) => {
         tooltip.transition()
         .style('visibility', "visible")
         d3.select("#tooltip")
         .style("left", d3.event.pageX+10 + "px")
         .style("top", d3.event.pageY-60 + "px")
         
   
         if(item['Doping'] != '') {
            tooltip.text(item['Year'] 
            + " - " 
            + item['Name'] 
            + ' - ' 
            + item['Time'] 
            + ' - ' 
            + item['Doping'])
         } else {
            tooltip.text(item['Year'] 
            + " - " 
            + item['Name'] 
            + ' - ' 
            + item['Time'] 
            + ' No Allegations')
         }
         tooltip.attr('data-year', item['Year'])
         
         })
      
      .on('mouseout', (item) => {
         tooltip.transition()
         .style('visibility', "hidden")
      });
}

let generateAxes = () => {
         let xAxis = d3.axisBottom(xScale)
         .tickFormat(d3.format('d'))

         svg.append('g')
         .call(xAxis)
         .attr('id','x-axis')
         .attr("transform", "translate(0," + (h - padding) + ")")

         let yAxis = d3.axisLeft(yScale)
         .tickFormat(d3.timeFormat('%M:%S'))

         svg.append('g')
         .call(yAxis)
         .attr('id','y-axis')
         .attr("transform", "translate(" + padding + ",0)");

         
}

req.open('GET', url, true)
req.onload = () => {
   dataset = JSON.parse(req.responseText)
   console.log(dataset)
   drawCanvas()
   generateScales()
   drawPoint()
   generateAxes()
   
}
req.send();