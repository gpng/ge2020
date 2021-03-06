import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
// components
import { Close } from './icons';
import Profile from './Profile';
// constants
import { COLORS, PARTY_COLORS } from '../constants/styles';
import { ED_DATA, PARTIES } from '../data';
import { WALKOVER } from '../constants';

const InfoPanel = ({ selected, setSelected }) => {
  const [data, setData] = useState();

  useEffect(() => {
    const edData = ED_DATA.find((x) => x.id === selected);
    setData(edData);
  }, [selected]);

  const voteKey = data?.incumbent?.actual ? 'actual' : 'sample';

  return (
    <div className="info-panel-root">
      <div className="placeholder" />
      <header className="header">
        <div className="name-wrapper">
          <div className="name">{data?.name}</div>
          <div className="electors">{`${data?.electors?.toLocaleString?.()} Electors`}</div>
        </div>
        {setSelected && (
          <div className="button-close-wrapper">
            <button type="button" className="button-close" onClick={() => setSelected(null)}>
              <Close height="16px" fill={COLORS.TEXT_PRIMARY} />
            </button>
          </div>
        )}
      </header>
      {data && (
        <div className="scrollable-container">
          <div className="title">
            {data.incumbent.actual ? 'GE2020 Final Results' : 'GE2020 Sample Count'}
          </div>
          <div className="history-row current-row">
            <div className="electors">{data.electorsVoted.toLocaleString()} Electors Voted</div>
            <div className="results">
              <div
                className={classNames('result-row', {
                  'result-row--win':
                    data.incumbent[voteKey] ===
                    Math.max(data.incumbent[voteKey], ...data.opposition.map((d) => d[voteKey])),
                })}
              >
                <div className="result-name">{data.incumbent.party}</div>
                <div className="result-votes">{`${data.incumbent[voteKey]}%`}</div>
              </div>
              {data.opposition.map((o) => (
                <div
                  key={o.party}
                  className={classNames('result-row', {
                    'result-row--win':
                      o[voteKey] ===
                      Math.max(data.incumbent[voteKey], ...data.opposition.map((d) => d[voteKey])),
                  })}
                >
                  <div className="result-name">{o.party}</div>
                  <div className="result-votes">{`${o[voteKey]}%`}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="title">Previous</div>
          <div className="row">
            <div className="label-container">
              <div className="party">
                <span>{data.current.party}</span>
                {PARTIES[data.current.party].logo && (
                  <img src={`/static/images/logos/${PARTIES[data.current.party].logo}`} alt="" />
                )}
              </div>
            </div>
            <div className="profiles">
              {data.current.members.map((d) => (
                <Profile
                  large
                  key={d.name}
                  image={d.image}
                  name={d.name}
                  color={PARTY_COLORS[data.current.party]}
                />
              ))}
            </div>
          </div>
          <div className="title">GE2020 Candidates</div>
          <div className="row">
            <div className="label-container">
              <div className="party">
                <span>{data.incumbent.party}</span>
                {PARTIES[data.incumbent.party].logo && (
                  <img src={`/static/images/logos/${PARTIES[data.incumbent.party].logo}`} alt="" />
                )}
              </div>
              <div
                className={classNames({
                  confirmed: data.incumbent.confirmed,
                  unconfirmed: !data.incumbent.confirmed,
                })}
              >
                {data.incumbent.confirmed ? 'Confirmed' : 'Unconfirmed'}
              </div>
              {PARTIES[data.incumbent.party].manifesto && (
                <a
                  className="link-manifesto"
                  href={PARTIES[data.incumbent.party].manifesto}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Party Manifesto
                </a>
              )}
              {data.incumbent.manifesto && (
                <a
                  className="link-manifesto"
                  href={data.incumbent.manifesto}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Area Manifesto
                </a>
              )}
            </div>
            <div className="profiles">
              {data.incumbent.members.map((d) => (
                <Profile
                  large
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
              <div className="label-container">
                <div className="party">
                  <span>{o.party}</span>
                  {PARTIES[o.party].logo && (
                    <img src={`/static/images/logos/${PARTIES[o.party].logo}`} alt="" />
                  )}
                </div>
                <div
                  className={classNames({
                    confirmed: o.confirmed,
                    unconfirmed: !o.confirmed,
                  })}
                >
                  {o.confirmed ? 'Confirmed' : 'Unconfirmed'}
                </div>
                {PARTIES[o.party].manifesto && (
                  <a
                    className="link-manifesto"
                    href={PARTIES[o.party].manifesto}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Party Manifesto
                  </a>
                )}
                {o.manifesto && (
                  <a
                    className="link-manifesto"
                    href={o.manifesto}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Area Manifesto
                  </a>
                )}
              </div>
              <div className="profiles">
                {o.members.map((d) => (
                  <Profile
                    large
                    key={d.name}
                    image={d.image}
                    name={d.name}
                    color={PARTY_COLORS[o.party]}
                  />
                ))}
              </div>
            </div>
          ))}
          {data.history && (
            <div className="history">
              <div className="title">Election History</div>
              {[2011, 2015, 2016].map((year) => {
                const history = data.history[year];
                if (!history) return null;
                return (
                  <div className="history-row" key={year}>
                    <div className="year">
                      {year}
                      {history.byElection ? ' (By-election)' : ''}
                    </div>
                    <div className="history-electors">
                      {history.electors.toLocaleString()} Electors
                    </div>
                    <div className="results">
                      {history.results === WALKOVER ? (
                        <div className="result-row walkover">Walkover</div>
                      ) : (
                        history.results.map((x, i) => (
                          <div
                            className={classNames('result-row', {
                              'result-row--win': i === 0,
                            })}
                            key={x.name}
                          >
                            <div className="result-name">{x.name}</div>
                            <div className="result-votes">
                              {`${x.votes.toLocaleString()} (${x.votesPerc}%)`}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div className="resources">
            <div className="title">More Resources</div>
            <div className="resources-row">
              <a
                className="link-resource"
                href="https://app.eservice.eld.gov.sg/voter/postalcodeenquiry.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                Check your Electoral Division using postcode
              </a>
            </div>
            <div className="resources-row">
              <a
                className="link-resource"
                href="https://app.eservice.eld.gov.sg/Voter/PollingStationEnquiry.aspx"
                target="_blank"
                rel="noopener noreferrer"
              >
                Find your polling station and timeslot
              </a>
            </div>
            <div className="resources-row">
              <a
                className="link-resource"
                href="https://cape.commons.yale-nus.edu.sg/2020/06/23/ge2020portal/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Yale-NUS Voter Education One-Stop Portal
              </a>
            </div>
            <div className="resources-row">
              <a
                className="link-resource"
                href="https://ge2020voter.carrd.co/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Resource hub for first-time voters
              </a>
            </div>
          </div>
          <div className="footer">
            <button
              type="button"
              className="button-report"
              onClick={() => {
                if (window?.$crisp) {
                  window.$crisp.push(['do', 'chat:show']);
                  window.$crisp.push(['do', 'chat:open']);
                }
              }}
            >
              Report inaccuracies or updates
            </button>
          </div>
        </div>
      )}
      <style jsx>
        {`
          .info-panel-root {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 22rem;
            background: ${COLORS.BACKGROUND_PRIMARY};
            transition: all 0.2s;
            box-shadow: 0px 8px 6px #00000029;
            z-index: 3;
            padding: 1rem;
            display: flex;
            flex-direction: column;
          }

          .header {
            width: 100%;
            display: flex;
            justify-content: space-between;
            margin-top: 8rem;
            flex: 0 0 auto;
            min-height: 1px;
            margin-bottom: 1rem;
            align-items: flex-start;
          }

          .name-wrapper {
            flex: 1 1 auto;
            min-width: 1px;
          }

          .button-close-wrapper {
            flex: 0 0 auto;
            min-width: 1px;
          }

          .button-close {
            padding: 0.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            background: transparent;
            border: none;
            box-shadow: 0px 1px 2px #00000029;
            border-radius: 50%;
          }

          .name {
            font-weight: bold;
            font-size: 1.2rem;
          }

          .scrollable-container {
            flex: 1 1 auto;
            min-height: 1px;
            overflow-y: auto;
          }

          .row {
            padding: 0.5rem 0;
            display: flex;
            align-items: flex-start;
          }

          .label-container {
            flex: 0 0 5rem;
            min-width: 1px;
            font-size: 1rem;
          }

          .label {
            font-weight: bold;
          }

          .profiles {
            flex: 1 1 auto;
            min-width: 1px;
            display: flex;
            align-items: flex-start;
            flex-wrap: wrap;
          }

          .confirmed {
            color: green;
            font-size: 0.6rem;
            margin-bottom: 0.25rem;
          }

          .unconfirmed {
            color: red;
            font-size: 0.6rem;
            margin-bottom: 0.25rem;
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

          .title {
            font-weight: bold;
            font-size: 1.1rem;
          }

          .history {
            margin-top: 2rem;
          }

          .history-row {
            margin-top: 1rem;
          }

          .current-row {
            margin-bottom: 2rem;
          }

          .year {
            font-weight: bold;
            font-size: 1.05rem;
            margin-bottom: 0.2rem;
          }

          .result-row {
            margin-top: 0.5rem;
            display: flex;
          }

          .result-row--win {
            color: green;
          }

          .walkover {
            font-weight: bold;
            color: green;
          }

          .result-name {
            flex: 0 0 4rem;
            min-width: 1px;
            font-weight: bold;
          }

          .footer {
            margin-top: 2rem;
          }

          .button-report {
            padding: 0;
            font-size: 0.8rem;
            border: none;
            text-decoration: underline;
            background: transparent;
          }

          .link-manifesto {
            display: block;
            white-space: nowrap;
            font-size: 0.7rem;
            margin-bottom: 0.2rem;
          }

          .resources {
            margin-top: 3rem;
          }

          .resources-row {
            margin: 0.5rem 0;
          }

          .link-resource {
            font-size: 0.8rem;
          }

          @media only screen and (max-width: 600px) {
            .info-panel-root {
              position: fixed;
              top: 100%;
              left: 0;
              height: 100%;
              width: 100vw;
              top: 0;
            }

            .header {
              margin-top: 6rem;
            }
          }
        `}
      </style>
    </div>
  );
};

InfoPanel.defaultProps = {
  selected: null,
  setSelected: null,
};

InfoPanel.propTypes = {
  selected: PropTypes.string,
  setSelected: PropTypes.func,
};

export default InfoPanel;
