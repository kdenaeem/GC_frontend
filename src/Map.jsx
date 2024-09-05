import { useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker
} from "react-simple-maps"
import { csv } from "d3-fetch"
import { scaleLinear } from "d3-scale";
import sortBy from "lodash/sortBy";

const geoUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

export default function MapChart() {
  const [data, setData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);

  const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position) {
    setPosition(position);
  }

  useEffect(() => {
    csv("/data.csv").then((cities) => {
      const sortedCities = sortBy(cities, (o) => -o.population);
      sortedCities.forEach(city => {
        console.log(`City: ${city.name}, Lng: ${city.lng}, Lat: ${city.lat}`);
      });
      setMaxValue(sortedCities[0].population);
      setData(sortedCities);
    });
  }, []);

  const popScale = useMemo(
    () => scaleLinear().domain([0, maxValue]).range([0, 24]),
    [maxValue]
  );



  return (
    <div>
      <ComposableMap projectionConfig={{ rotate: [-10, 0, 0]}}>
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#06F" },
                    hover: { fill: "#04D" },
                    pressed: { fill: "#02A" },
                  }}
                />
              ))
            }
          </Geographies>
          {data.map(({city_code, lng, lat, population}) => {
            return (
            <Marker key={city_code} coordinates={[lng ,lat]}>
              <circle fill="#F53" stroke="#FFF" r={popScale(population)}/>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      <div className="controls">
        <button onClick={handleZoomIn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button onClick={handleZoomOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>

      </div>
    </div>
  );
}
