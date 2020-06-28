import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../constants/styles';

const Close = ({ fill, height }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 9" height={height} width={height}>
    <g id="Layer_2" data-name="Layer 2">
      <g id="Layer_1-2" data-name="Layer 1">
        <line className="cls-1" x1="0.5" y1="0.5" x2="8.5" y2="8.5" />
        <line className="cls-1" x1="0.5" y1="8.5" x2="8.5" y2="0.5" />
      </g>
    </g>
    <style jsx>
      {`
        .cls-1 {
          fill: none;
          stroke: ${fill};
          stroke-linecap: round;
          stroke-miterlimit: 10;
        }
      `}
    </style>
  </svg>
);

Close.defaultProps = {
  fill: COLORS.TEXT_PRIMARY,
  height: '1rem',
};

Close.propTypes = {
  fill: PropTypes.string,
  height: PropTypes.string,
};

export default Close;
