import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// components
import Profile from './Profile';
// constants
import { COLORS, PARTY_COLORS } from '../constants/styles';
import { ED_DATA, PARTIES } from '../data';
import { Close } from './icons';

const VirusMarker = ({ x, y, id, onClose }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!id) {
      setData(null);
      return;
    }
    const edData = ED_DATA.find((d) => d.id === id);
    if (!edData) {
      setData(null);
      return;
    }
    setData(edData);
  }, [id]);

  if (!data) return null;

  return (
    <button type="button" className="tooltip-root">
      <div className="header">
        <div>
          <div className="name">{data.name}</div>
          <div className="electors">{`${data.electors?.toLocaleString?.()} Electors`}</div>
        </div>
        <button type="button" className="button-close" onClick={onClose}>
          <Close height="0.75rem" />
        </button>
      </div>
      <div className="row">
        <span className="label-container">
          <div className="label">Current</div>
          <div className="party">
            <span>{data.current.party}</span>
            <img src={`/static/images/logos/${PARTIES[data.current.party].logo}`} alt="" />
          </div>
        </span>
        <div className="profiles">
          {data.current.members.map((d) => (
            <Profile
              key={d.name}
              image={d.image}
              name={d.name}
              color={PARTY_COLORS[data.current.party]}
            />
          ))}
        </div>
      </div>
      <div className="row">
        <span className="label-container">
          <div className="label">Incumbent</div>
          <div className="party">
            <span>{data.incumbent.party}</span>
            <img src={`/static/images/logos/${PARTIES[data.incumbent.party].logo}`} alt="" />
          </div>
          <div
            className={classNames({
              confirmed: data.incumbent.confirmed,
              unconfirmed: !data.incumbent.confirmed,
            })}
          >
            {data.incumbent.confirmed ? 'Confirmed' : 'Unconfirmed'}
          </div>
        </span>
        <div className="profiles">
          {data.incumbent.members.map((d) => (
            <Profile
              key={d.name}
              image={d.image}
              name={d.name}
              color={PARTY_COLORS[data.incumbent.party]}
            />
          ))}
        </div>
      </div>
      {data.opposition.map((o) => (
        <div className="row" key={o.party}>
          <span className="label-container">
            <div className="label">Opposition</div>
            <div className="party">
              <span>{o.party}</span>
              <img src={`/static/images/logos/${PARTIES[o.party].logo}`} alt="" />
            </div>
            <div
              className={classNames({
                confirmed: o.confirmed,
                unconfirmed: !o.confirmed,
              })}
            >
              {o.confirmed ? 'Confirmed' : 'Unconfirmed'}
            </div>
          </span>
          <div className="profiles">
            {o.members.map((d) => (
              <Profile key={d.name} image={d.image} name={d.name} color={PARTY_COLORS[o.party]} />
            ))}
          </div>
        </div>
      ))}
      <style jsx>{`
        .tooltip-root {
          overflow: hidden;
          pointer-events: auto;
          box-shadow: 0px 3px 6px #00000029;
          border-radius: 5px;
          transform: translate(-50%, calc(-100% - 0.75rem));
          background: ${COLORS.BACKGROUND_PRIMARY};
          position: absolute;
          top: ${y}px;
          left: ${x}px;
          z-index: 2;
          border: none;
          text-align: left;
          padding: 0.5rem;
          min-width: 9rem;
          max-height: calc(100% - 1rem);
        }

        .name {
          font-size: 1rem;
          font-weight: bold;
        }

        .electors {
          font-size: 0.8rem;
        }

        .row {
          padding: 0.5rem 0;
          display: flex;
          align-items: flex-start;
        }

        .label-container {
          flex: 0 0 5rem;
          min-width: 1px;
          font-size: 0.8rem;
        }

        .label {
          font-weight: bold;
        }

        .profiles {
          flex: 1 1 auto;
          min-width: 1px;
          display: flex;
          align-items: flex-start;
        }

        .confirmed {
          color: green;
          font-size: 0.6rem;
        }

        .unconfirmed {
          color: red;
          font-size: 0.6rem;
        }

        .party {
          margin: 0.2rem 0;
          display: flex;
          align-items: center;
        }

        .party > img {
          height: 1.5rem;
          margin-left: 0.5rem;
        }

        .header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        .button-close {
          display: none;
          border: none;
          padding: 0.25rem;
          margin-left: 1rem;
        }

        @media only screen and (max-width: 600px) {
          .tooltip-root {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            max-width: calc(100vw - 1rem);
            overflow-y: auto;
          }

          .profiles {
            flex-wrap: wrap;
          }

          .button-close {
            display: inline-block;
          }
        }
      `}</style>
    </button>
  );
};

VirusMarker.defaultProps = {
  x: 0,
  y: 0,
  id: null,
};

VirusMarker.propTypes = {
  x: PropTypes.number,
  y: PropTypes.number,
  id: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default VirusMarker;
