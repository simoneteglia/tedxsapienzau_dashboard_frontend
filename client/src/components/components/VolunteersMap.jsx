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
  const [year, setYear] = useState("all");
  const [availableYears, setAvailableYears] = useState([]);
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    const fetchVolunteersByYear = async () => {
      try {
        const res = await fetch(
          `${global.CONNECTION.ENDPOINT}/volunteers/by_year?year=all`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();

        if (data.volunteers_by_year) {
          const years = Object.keys(data.volunteers_by_year)
            .map((y) => parseInt(y))
            .sort((a, b) => b - a);
          setAvailableYears(years);

          const all = Object.values(data.volunteers_by_year).flat();
          setVolunteers(all);
        }
      } catch (err) {
        console.error("Error fetching volunteers by year:", err);
      }
    };
    fetchVolunteersByYear();
  }, []);

  useEffect(() => {
    if (year === "all") return;

    const fetchVolunteersForYear = async () => {
      try {
        const res = await fetch(
          `${global.CONNECTION.ENDPOINT}/volunteers/by_year?year=${year}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        if (data.volunteers) setVolunteers(data.volunteers);
      } catch (err) {
        console.error("Error fetching volunteers for year:", err);
      }
    };
    fetchVolunteersForYear();
  }, [year]);

  useEffect(() => {
    if (volunteers.length === 0) return;

    const municipalitiesKey = Object.keys(italyTopo.objects).find((k) =>
      k.toLowerCase().includes("m")
    );
    const geojson = feature(italyTopo, italyTopo.objects[municipalitiesKey]);

    const counts = {};
    volunteers.forEach((v) => {
      const placeRaw =
        locationType === "nascita" ? v.place_of_birth : v.place_of_residence;
      const place = placeRaw?.trim().toLowerCase();
      if (!place) return;
      counts[place] = (counts[place] || 0) + 1;
    });

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = svgRef.current.clientWidth;
    const height = width * 1.25;

    const projection = d3
      .geoMercator()
      .center([12.5, 42.5])
      .scale(5000)
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    if (mode === "choropleth") {
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
      svg
        .selectAll("path")
        .data(geojson.features)
        .join("path")
        .attr("d", path)
        .attr("fill", "#f0f0f0")
        .attr("stroke", "#999")
        .attr("stroke-width", 0.2);

      const maxCount = Math.max(...Object.values(counts), 1);
      const radiusScale = d3.scaleSqrt().domain([1, maxCount]).range([2, 20]);

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
        .attr("fill", "none")
        .attr("stroke", "#EB0028")
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
        <button
          onClick={() => setLocationType("residenza")}
          style={{ marginRight: "20px" }}
        >
          Luogo di Residenza
        </button>

        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="all">Tutti gli anni</option>
          {availableYears.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
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
