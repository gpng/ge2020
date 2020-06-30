import React from 'react';
import PropTypes from 'prop-types';

const Profile = ({ image, color, name }) => {
  return (
    <div className="profile-root">
      <div className="image-wrapper">
        <img src={`/static/images/profiles/${image}`} alt="" />
      </div>
      <div className="name">{name}</div>
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

        .image-wrapper {
          width: 2rem;
          height: 2rem;
          border-radius: 50%;
          border: 2px solid ${color};
          overflow: hidden;
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
      `}</style>
    </div>
  );
};

Profile.defaultProps = {
  image: 'person.svg',
};

Profile.propTypes = {
  image: PropTypes.string,
  color: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default Profile;
