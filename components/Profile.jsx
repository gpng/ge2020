import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const Profile = ({ image, color, name, large }) => {
  return (
    <div
      className={classNames('profile-root', {
        'profile-root--large': large,
      })}
    >
      <div
        className={classNames('image-wrapper', {
          'image-wrapper--large': large,
        })}
      >
        <img src={`/static/images/profiles/${image}`} alt="" />
      </div>
      <div
        className={classNames('name', {
          'name--large': large,
        })}
      >
        {name}
      </div>
      <style jsx>{`
        .profile-root {
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 3rem;
          justify-content: flex-start;
          margin-left: 0.5rem;
          margin-bottom: 0.4rem;
        }

        .profile-root--large {
          width: 4rem;
        }

        .image-wrapper {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 2px solid ${color};
          overflow: hidden;
        }

        .image-wrapper--large {
          width: 2.5rem;
          height: 2.5rem;
        }

        .image-wrapper > img {
          height: auto;
          width: 100%;
        }

        .name {
          margin-top: 0.2rem;
          text-align: center;
          font-size: 0.6rem;
          white-space: wrap;
        }

        .name--large {
          font-size: 0.8rem;
        }
      `}</style>
    </div>
  );
};

Profile.defaultProps = {
  image: 'person.svg',
  large: false,
};

Profile.propTypes = {
  image: PropTypes.string,
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  large: PropTypes.bool,
};

export default Profile;
