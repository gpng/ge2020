/* eslint-disable no-unused-vars */
/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef, useEffect } from 'react';
import ReactMapGL, {
  WebMercatorViewport,
  FlyToInterpolator,
  TRANSITION_EVENTS,
  NavigationControl,
  HTMLOverlay,
} from 'react-map-gl';
import Head from 'next/head';
import orderBy from 'lodash/orderBy';
import flattenDepth from 'lodash/flattenDepth';
// components
import Tooltip from '../components/Tooltip';
// constants
import { MAPBOX_STYLE, MAPBOX_TOKEN } from '../constants';
import META from '../constants/meta';
// data
import { ED_DATA, PARTIES } from '../data';
import boundaryGeojson from '../data/boundaries.json';
import { PARTY_COLORS } from '../constants/styles';

const initialViewState = {
  longitude: 103.80871128739545,
  latitude: 1.3528246962995887,
  zoom: 8,
  pitch: 0,
  bearing: 0,
};

const initialBbox = [
  [103.56544388367797, 1.197961725210657],
  [104.10960309887196, 1.4957485068241767],
];

const fillLayerId = 'layer-boundaries-fill';
const lineLayerId = 'layer-boundaries-line';
const sourceId = 'source-boundaries';

const Index = () => {
  const [viewport, setViewport] = useState(initialViewState);
  const mapRef = useRef(null);

  const [hovered, setHovered] = useState(null);
  const prevHovered = useRef(null);

  const [selectedEd, setSelectedEd] = useState('all');

  const [disableHover, setDisableHover] = useState(false);

  const fitMapToBounds = (points) => {
    const { longitude, latitude, zoom } = new WebMercatorViewport(viewport).fitBounds(points);
    setViewport({
      ...viewport,
      longitude,
      latitude,
      zoom,
      transitionDuration: 500,
      transitionInterpolator: new FlyToInterpolator(),
      transitionInterruption: TRANSITION_EVENTS.BREAK,
    });
  };

  const addFeatureStates = () => {
    const map = mapRef.current;
    if (!map) return;
    ED_DATA.forEach(({ featureId, current, opposition }) => {
      if (current) {
        map.setFeatureState(
          {
            source: sourceId,
            id: featureId,
          },
          {
            fillColor: PARTY_COLORS[current.party],
            outlineColor: opposition?.length > 0 ? PARTY_COLORS[opposition[0].party] : null,
            visible: true,
            hovered: false,
          },
        );
      }
    });
  };

  const handleMapLoad = () => {
    if (!mapRef.current) return;
    const map = mapRef.current;

    if (!map.isStyleLoaded()) return;

    const hasSource = !!map.getSource(sourceId);
    const hasFillLayer = !!map.getLayer(fillLayerId);
    const hasLineLayer = !!map.getLayer(lineLayerId);

    if (!hasSource || !hasFillLayer) {
      if (hasFillLayer) {
        map.removeLayer(fillLayerId);
      }
      if (hasLineLayer) {
        map.removeLayer(lineLayerId);
      }
      if (hasSource) {
        map.removeSource(sourceId);
      }
      map.addSource(sourceId, {
        type: 'geojson',
        data: boundaryGeojson,
      });

      // Add a layer for fill
      map.addLayer({
        id: fillLayerId,
        type: 'fill',
        source: sourceId,
        paint: {
          'fill-color': [
            'case',
            ['!=', ['feature-state', 'fillColor'], null],
            ['feature-state', 'fillColor'],
            'rgba(0, 0, 0, 0.1)',
          ],
          'fill-outline-color': 'rgba(0, 0, 0, 1)',
          'fill-opacity': ['case', ['boolean', ['feature-state', 'hovered'], true], 0.8, 0.4],
        },
      });
      // layer for line
      map.addLayer({
        id: lineLayerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': [
            'case',
            ['!=', ['feature-state', 'outlineColor'], null],
            ['feature-state', 'outlineColor'],
            'rgba(0, 0, 0, 0)',
          ],
          'line-width': 4,
          'line-opacity': ['case', ['boolean', ['feature-state', 'hovered'], true], 1, 0.6],
        },
      });
    }

    addFeatureStates();
  };

  const handleHover = (ev) => {
    if (disableHover || ev?.pointerType === 'touch') {
      return;
    }
    const ed = ev?.features?.find((x) => x.layer.id === fillLayerId);
    if (!ed?.properties?.id || !ed?.state?.visible) {
      setHovered(null);
      return;
    }
    setHovered({
      id: ed?.properties?.id,
      featureId: ed?.id,
      x: ev.point[0],
      y: ev.point[1],
    });
  };

  const handleClick = (ev) => {
    if (ev?.pointerType !== 'touch') return;
    const ed = ev?.features?.find((x) => x.layer.id === fillLayerId);
    if (!ed?.properties?.id || !ed?.state?.visible) {
      setHovered(null);
      return;
    }
    setHovered({
      id: ed?.properties?.id,
      featureId: ed?.id,
      x: ev.point[0],
      y: ev.point[1],
    });
  };

  const handlePartyChange = (ev) => {
    const map = mapRef.current;
    if (!map) return;
    const party = ev.target.value;
    const showAll = party === 'all';
    ED_DATA.forEach((x) => {
      const isVisible =
        showAll || x.current.party === party || x.opposition.some((o) => o.party === party);
      map.setFeatureState(
        {
          source: sourceId,
          id: x.featureId,
        },
        {
          fillColor: isVisible ? PARTY_COLORS[x.current.party] : 'rgba(0, 0, 0, 0)',
          outlineColor:
            isVisible && x.opposition?.length > 0 ? PARTY_COLORS[x.opposition[0].party] : null,
          visible: isVisible,
        },
      );
    });
    setHovered(null);
  };

  const handleEdChange = (ev) => {
    setSelectedEd('all');
    const id = ev.target.value;
    const geojson = boundaryGeojson.features.find((x) => x.properties.id === id);
    if (!geojson) return;
    const points = flattenDepth(geojson.geometry.coordinates, 2);
    const lon = points.map((x) => x[0]);
    const lat = points.map((x) => x[1]);
    // disable hover for 0.5s
    setDisableHover(true);
    setTimeout(() => {
      setDisableHover(false);
    }, 500);
    fitMapToBounds([
      [Math.min(...lon), Math.min(...lat)],
      [Math.max(...lon), Math.max(...lat)],
    ]);
    setHovered({
      id,
      featureId: geojson.id,
      x: (window?.innerWidth ?? 0) / 2,
      y: (window?.innerHeight ?? 0) / 2,
    });
  };

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (hovered?.featureId && hovered.featureId !== prevHovered.current?.featureId) {
      map.setFeatureState(
        {
          source: sourceId,
          id: hovered.featureId,
        },
        {
          hovered: true,
        },
      );
      if (prevHovered.current) {
        map.setFeatureState(
          {
            source: sourceId,
            id: prevHovered.current.featureId,
          },
          {
            hovered: false,
          },
        );
      }
    }
    if (!hovered && prevHovered.current) {
      map.setFeatureState(
        {
          source: sourceId,
          id: prevHovered.current.featureId,
        },
        {
          hovered: false,
        },
      );
    }
    prevHovered.current = hovered;
  }, [hovered]);

  return (
    <>
      <Head>
        <title>{META.TITLE}</title>
        {/* title */}
        <meta property="og:title" key="og-title" content={META.TITLE} />
        <meta name="twitter:title" key="twitter-title" content={META.TITLE} />
        {/* descriptions */}
        <meta name="description" key="description" content={META.DESCRIPTION} />
        <meta property="og:description" key="og-description" content={META.DESCRIPTION} />
        <meta name="twitter:description" key="twitter-description" content={META.DESCRIPTION} />
        {/* url */}
        <meta property="og:url" key="og-url" content={META.URL} />
        <meta name="twitter:url" key="twitter-url" content={META.URL} />
        {/* image */}
        <meta property="og:image" content="https://ge2020.now.sh/static/images/social.png" />
        <meta name="twitter:image" content="https://ge2020.now.sh/static/images/social.png" />
        {/* twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta property="og:type" key="og-type" content="website" />

        <meta name="robots" key="robots" content="index, follow" />
        <link rel="icon" type="image/png" href="/static/icons/favicon.png" />

        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>
      <div className="root">
        <div className="map">
          <ReactMapGL
            {...viewport}
            width="100%"
            height="100%"
            onViewportChange={setViewport}
            mapboxApiAccessToken={MAPBOX_TOKEN}
            mapStyle={MAPBOX_STYLE}
            ref={(ref) => {
              mapRef.current = ref?.getMap?.();
            }}
            onLoad={() => {
              handleMapLoad();
              fitMapToBounds(initialBbox);
            }}
            onHover={handleHover}
            onClick={handleClick}
            onTouchMove={() => setHovered(null)}
          >
            <div className="navigation">
              <NavigationControl onViewportChange={setViewport} showCompass={false} captureClick />
            </div>
          </ReactMapGL>
          <div className="select-containers">
            <div className="party-select-container">
              <select className="party-select" onChange={handlePartyChange}>
                <option value="all">All Parties</option>
                {orderBy(Object.values(PARTIES), 'name').map((x) => (
                  <option key={x.id} value={x.id}>{`${x.name} (${x.id})`}</option>
                ))}
              </select>
            </div>
            <div className="ed-select-container">
              <select className="ed-select" onChange={handleEdChange} value={selectedEd}>
                <option value="all">Select a electoral district</option>
                {orderBy(ED_DATA, 'name').map((x) => (
                  <option key={x.id} value={x.id}>
                    {x.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {hovered && (
            <Tooltip
              id={hovered?.id}
              x={hovered?.x}
              y={hovered?.y}
              onClose={() => setHovered(null)}
            />
          )}
        </div>
        <style jsx>
          {`
            .root {
              height: 100%;
              width: 100vw;
              overflow: hidden;
              display: flex;
            }

            .panel {
              flex: 0 0 300px;
              box-shadow: 0px 8px 6px #00000029;
            }

            .map {
              flex: 1 1 auto;
              position: relative;
            }

            .select-containers {
              position: fixed;
              top: 1rem;
              left: 1rem;
              z-index: 1;
            }

            .ed-select-container {
              margin-top: 1rem;
            }

            .navigation {
              position: absolute;
              top: 1rem;
              right: 1rem;
              z-index: 1;
            }
          `}
        </style>
      </div>
    </>
  );
};

export default Index;
