
import React from 'react';

interface AppraisalButtonProps {
  title: string;
  icon: React.ReactNode;
  isShrunk?: boolean;
}

const AppraisalButton: React.FC<AppraisalButtonProps> = ({ title, icon, isShrunk }) => {
  return (
    <button className="w-full h-full bg-[rgb(23,42,53)] text-white flex items-center justify-center gap-2 p-2 text-center hover:bg-[rgb(238,64,55)] transition-all duration-300 ease-in-out overflow-hidden">
        {/* El icono siempre está visible en el móvil, se encoge en el escritorio cuando isShrunk es verdadero */}
        <div className={`transition-all duration-500 ease-in-out flex-shrink-0 w-6 h-6 opacity-100 ${isShrunk ? 'md:w-0 md:opacity-0' : 'md:w-8 md:h-8'}`}>
            {icon}
        </div>
        {/* El tamaño del texto es estático en el móvil, cambia en el escritorio cuando isShrunk es verdadero */}
        <span className={`font-semibold tracking-wide transition-all duration-700 ease-in-out whitespace-nowrap text-xs ${isShrunk ? 'md:text-xs' : 'md:text-base'}`}>
            {title}
        </span>
    </button>
  );
};

export default AppraisalButton;
