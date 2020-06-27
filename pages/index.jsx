/* eslint-disable react/jsx-props-no-spreading */
import React, { useState, useRef } from 'react';
import ReactMapGL, {
  WebMercatorViewport,
  FlyToInterpolator,
  TRANSITION_EVENTS,
} from 'react-map-gl';
// translations
import useTranslations from '../translations/useTranslations';
// components
import Tooltip from '../components/Tooltip';
// constants
import { MAPBOX_STYLE, MAPBOX_TOKEN } from '../constants';
// data
import { ED_DATA } from '../data';
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
  const { t } = useTranslations();

  const [viewport, setViewport] = useState(initialViewState);
  const mapRef = useRef(null);

  const [hovered, setHovered] = useState(null);

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
          'fill-opacity': 0.4,
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
          'line-opacity': 0.6,
        },
      });
    }

    addFeatureStates();
  };

  const handleHover = (ev) => {
    const ed = ev?.features?.find((x) => x.layer.id === fillLayerId);
    if (!ed?.properties?.id) {
      setHovered(null);
    }
    setHovered({
      id: ed?.properties?.id,
      x: ev.point[0],
      y: ev.point[1],
    });
  };

  return (
    <div className="root">
      <div className="panel">
        <h1>{t('index.title')}</h1>
      </div>
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
        >
          {hovered && <Tooltip id={hovered?.id} x={hovered?.x} y={hovered?.y} />}
        </ReactMapGL>
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
          }
        `}
      </style>
    </div>
  );
};

export default Index;
