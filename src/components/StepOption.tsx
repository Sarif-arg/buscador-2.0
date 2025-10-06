import React from 'react';

interface StepOptionProps {
  label: string;
  onClick: () => void;
}

const StepOption: React.FC<StepOptionProps> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex-grow flex-1 min-w-[140px] text-base md:text-lg bg-white/10 backdrop-blur-sm border border-white/20 p-3 text-center text-white font-semibold hover:bg-[rgb(238,64,55)] hover:border-[rgb(238,64,55)] transition-all duration-300 transform hover:scale-105"
    >
      {label}
    </button>
  );
};

export default StepOption;
