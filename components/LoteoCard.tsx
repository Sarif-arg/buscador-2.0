
import React from 'react';

interface LoteoCardProps {
  name: string;
  imageUrl: string;
  url: string;
}

const LoteoCard: React.FC<LoteoCardProps> = ({ name, imageUrl, url }) => {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative aspect-square w-full max-w-[250px] bg-cover bg-center rounded-lg overflow-hidden group transform hover:scale-105 transition-transform duration-300"
      style={{ backgroundImage: `url(${imageUrl})` }}
      aria-label={`Ver más sobre ${name}`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-20 transition-all duration-300"></div>
      <h4 className="absolute bottom-0 left-0 p-4 text-white text-xl font-bold tracking-wide">
        {name}
      </h4>
    </a>
  );
};

export default LoteoCard;
