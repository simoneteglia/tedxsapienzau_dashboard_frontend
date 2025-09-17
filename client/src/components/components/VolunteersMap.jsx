import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { feature } from "topojson-client";
import italyTopo from "../../assets/limits_IT_all.topo.json";
import global from "../../global.json";

export default function VolunteersMap() {
  const svgRef = useRef();
  const [volunteers, setVolunteers] = useState([]);
  const [mode, setMode] = useState("choropleth"); // "choropleth" , "bubble"
  const [locationType, setLocationType] = useState("nascita"); // "nascita" , "residenza"

  useEffect(() => {
    const fetchVolunteers = async () => {
      try {
        const res = await fetch(`${global.CONNECTION.ENDPOINT}/volunteers`);
        const data = await res.json();
        if (data.volunteers) setVolunteers(data.volunteers);
      } catch (err) {
        console.error("Error fetching volunteers", err);
      }
    };
    fetchVolunteers();
  }, []);

  useEffect(() => {
    if (volunteers.length === 0) return;

    // Extract municipalities from TopoJSON
    const municipalitiesKey = Object.keys(italyTopo.objects).find((k) =>
      k.toLowerCase().includes("m")
    );
    const geojson = feature(italyTopo, italyTopo.objects[municipalitiesKey]);

    // Count volunteers per municipality
    const counts = {};
    volunteers.forEach((v) => {
      const placeRaw =
        locationType === "nascita" ? v.luogo_di_nascita : v.luogo_di_residenza;
      const place = placeRaw?.trim().toLowerCase();
      if (!place) return;
      counts[place] = (counts[place] || 0) + 1;
    });

    // Set up SVG
    const width = svgRef.current.clientWidth;
    const height = width * 1.25;
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // clear previous

    const projection = d3
      .geoMercator()
      .center([12.5, 42.5])
      .scale(5000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    if (mode === "choropleth") {
      // Color scale based on counts
      const maxCount = Math.max(...Object.values(counts), 1);
      const colorScale = d3
        .scaleSequential(d3.interpolateReds)
        .domain([0, maxCount]);

      // Choropleth mode
      svg
        .selectAll("path")
        .data(geojson.features)
        .join("path")
        .attr("d", path)
        .attr("fill", (d) => {
          const name = d.properties.name.toLowerCase();
          return counts[name] ? "#EB0028" : "#f0f0f0";
        })
        .attr("stroke", "#999")
        .attr("stroke-width", 0.3)
        .append("title")
        .text(
          (d) =>
            `${d.properties.name}: ${
              counts[d.properties.name.toLowerCase()] || 0
            } volontari`
        );
    } else if (mode === "bubble") {
      // Base map
      svg
        .selectAll("path")
        .data(geojson.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#f0f0f0")
        .attr("stroke", "#999")
        .attr("stroke-width", 0.2);

      // Bubble scale
      const maxCount = Math.max(...Object.values(counts), 1);
      const radiusScale = d3.scaleSqrt().domain([1, maxCount]).range([2, 20]);

      // Add bubbles
      svg
        .selectAll("circle")
        .data(
          geojson.features.filter(
            (d) => counts[d.properties.name.toLowerCase()]
          )
        )
        .join("circle")
        .attr("cx", (d) => path.centroid(d)[0])
        .attr("cy", (d) => path.centroid(d)[1])
        .attr("r", (d) => radiusScale(counts[d.properties.name.toLowerCase()]))
        .attr("fill", "none") // empty inside
        .attr("stroke", "#EB0028") // red border
        .attr("stroke-width", 1.5)
        .append("title")
        .text(
          (d) =>
            `${d.properties.name}: ${
              counts[d.properties.name.toLowerCase()] || 0
            } volontari`
        );
    }
  }, [volunteers, mode, locationType]);

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <button
          onClick={() => setMode("choropleth")}
          style={{ marginRight: "5px" }}
        >
          Choropleth
        </button>
        <button
          onClick={() => setMode("bubble")}
          style={{ marginRight: "20px" }}
        >
          Bubble Map
        </button>
        <button
          onClick={() => setLocationType("nascita")}
          style={{ marginRight: "5px" }}
        >
          Luogo di Nascita
        </button>
        <button onClick={() => setLocationType("residenza")}>
          Luogo di Residenza
        </button>
      </div>
      <svg
        ref={svgRef}
        width="100%"
        height="auto"
        viewBox="-200 0 1400 1750"
      ></svg>
    </div>
  );
}
