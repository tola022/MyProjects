import React from 'react';

const Fun: React.FC = () => {
  return (
    <div className="container mt-4">
      <h1 className='text-white'>Welcome to my fun zone</h1>

      {/* Audio Player Section */}
      <div>
        <audio controls className="Fun">
          <source src="tu-tu-tu-du-max-verstappen.mp3" type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    </div>
  );
};

export default Fun;