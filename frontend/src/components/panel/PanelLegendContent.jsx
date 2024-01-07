import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

// Third-party libraries
import * as d3 from 'd3';

// generate a reusable ramp for visualizing color scales
function ramp(color, n = 256) {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  // create a vertical color ramp
  canvas.width = 1;
  canvas.height = n;
  for (let i = 0; i < n; ++i) {
    context.fillStyle = color(i / (n - 1));
    context.fillRect(0, n - i, 1, 1); // x, y, width, height
  }

  return canvas;
}

const PanelLegendContent = () => {
  const sband_raster = useSelector((state) => state.raster.sband_raster);
  const scalar_variable = useSelector((state) => state.raster.scalar_variable);

  // use a ref to store a reference to our svg element
  const svgRef = useRef(null);

  useEffect(() => {
    // set default settings
    const ticks = 6;
    const tickSize = 14;
    const width = 30 + tickSize;
    const height = 320;
    const marginTop = 18;
    const marginRight = 10 + tickSize;
    const marginBottom = 5;
    const marginLeft = 5;

    // use `d3.select()` to turn our ref into a d3 selection object
    const svgElement = d3.select(svgRef.current);

    // first remove the old svg
    svgElement.selectAll('*').remove();

    // update attributes and styles
    svgElement
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .style('overflow', 'visible')
      .style('display', 'block');

    // intialize a sequential scale
    const domain = [scalar_variable.min, scalar_variable.max];
    const scale = d3.scaleSequential(domain, d3[`interpolate${scalar_variable.scheme}`]);
    /*     
    how to call a function from a string
    example)
    d3[`interpolate${legend.scheme}`] => d3.interpolateMagma 
    */

    // modify the scale
    let x = Object.assign(
      scale.copy().interpolator(d3.interpolateRound(height - marginBottom, marginTop)),
      {
        range() {
          return [height - marginBottom, marginTop];
        },
      }
    );

    // add a color image
    svgElement
      .append('image')
      .attr('x', marginLeft)
      .attr('y', marginTop)
      .attr('width', width - marginLeft - marginRight)
      .attr('height', height - marginTop - marginBottom)
      .attr('preserveAspectRatio', 'none')
      .attr('href', ramp(scale.interpolator()).toDataURL());

    // set ticks and tick labels
    svgElement
      .append('g')
      .attr('transform', `translate(${width - marginRight},0)`)
      .call(
        d3
          .axisRight(x)
          .ticks(
            ticks,
            typeof scalar_variable.tickFormat === 'string' ? scalar_variable.tickFormat : undefined
          )
          .tickFormat(
            typeof scalar_variable.tickFormat === 'function'
              ? scalar_variable.tickFormat
              : undefined
          )
          .tickSize(tickSize)
      )
      .call((g) =>
        g
          .append('text')
          .attr('x', marginLeft + marginRight - width)
          .attr('y', 0)
          .attr('fill', 'currentColor')
          .attr('text-anchor', 'start')
          .attr('font-size', '12px')
          .attr('font-weight', 'bold')
          .attr('class', 'title')
          .text(scalar_variable.title)
      );
  }, [scalar_variable, sband_raster]);

  return Object.keys(sband_raster).length !== 0 && <svg ref={svgRef} />;
};

export default PanelLegendContent;
