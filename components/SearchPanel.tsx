
import React from 'react';

interface SearchPanelProps {
  title: string;
  imageUrl: string;
  onClick: () => void;
  isActive: boolean;
  isShrunk: boolean;
  children?: React.ReactNode;
}

const SearchPanel: React.FC<SearchPanelProps> = ({ title, imageUrl, onClick, isActive, isShrunk, children }) => {
  const panelClasses = `
    relative flex flex-col justify-center items-center
    bg-cover bg-center overflow-hidden cursor-pointer 
    transition-all duration-700 ease-in-out group
    w-full
    ${isActive ? 'h-[90%]' : isShrunk ? 'h-[10%]' : 'h-1/2'}
    md:h-full
    ${isActive ? 'md:w-[90%]' : isShrunk ? 'md:w-[10%]' : 'md:w-1/2'}
  `;

  const overlayClasses = `
    absolute inset-0 bg-[rgb(13,30,40)]
    transition-all duration-700 ease-in-out
    ${isActive ? 'bg-opacity-80' : 'bg-opacity-50 group-hover:bg-opacity-60'}
  `;

  const titleClasses = `
    text-white font-bold tracking-wider uppercase text-center
    transition-all duration-700 ease-in-out z-10
    ${isShrunk ? 'transform md:rotate-90 md:whitespace-nowrap text-2xl' : 'text-3xl md:text-5xl'}
  `;

  return (
    <div
      className={panelClasses}
      style={{ backgroundImage: `url(${imageUrl})` }}
      onClick={!isActive ? onClick : undefined}
    >
      <div className={overlayClasses}></div>
      {isActive ? (
        <div className="z-10 w-full h-full text-white p-4 md:p-8 flex flex-col justify-center items-center overflow-y-auto">
            {children}
        </div>
      ) : (
        <h2 className={titleClasses}>{title}</h2>
      )}
    </div>
  );
};

export default SearchPanel;
