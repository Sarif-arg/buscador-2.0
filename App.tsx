
import React, { useState, useCallback, useMemo } from 'react';
import SearchPanel from './components/SearchPanel';
import StepOption from './components/StepOption';
import AppraisalButton from './components/AppraisalButton';
import { PROPERTY_TYPES, LOCATIONS, BEDROOMS } from './constants';
import { getSearchUrl } from './searchLinks';
import type { Operation, SearchCriteria, StepOptionData } from './types';

const PropertyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h7.5" />
    </svg>
);

const KeyIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-full h-full">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.924-.644 1.49-.644h.001c.566 0 1.086.24 1.49.644l4.5 4.5Z" />
    </svg>
);

const keyTranslations: { [key in keyof SearchCriteria]?: string } = {
    operation: 'Operación',
    propertyType: 'Tipo de Propiedad',
    location: 'Localidad',
    bedrooms: 'Dormitorios',
};


const App: React.FC = () => {
    const [activeOperation, setActiveOperation] = useState<Operation | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
        operation: null,
        propertyType: null,
        location: null,
        bedrooms: null,
    });

    const resetSearch = useCallback(() => {
        setActiveOperation(null);
        setCurrentStep(0);
        setSearchCriteria({
            operation: null,
            propertyType: null,
            location: null,
            bedrooms: null,
        });
    }, []);

    const handleOperationSelect = useCallback((operation: Operation) => {
        setActiveOperation(operation);
        setSearchCriteria(prev => ({ ...prev, operation }));
        setCurrentStep(1);
    }, []);

    const handleOptionSelect = useCallback((step: number, value: string) => {
        switch (step) {
            case 1: // Property Type
                const newCriteria = { ...searchCriteria, propertyType: value };
                setSearchCriteria(newCriteria);
                // Si el tipo de propiedad es casa o depto, vamos al paso de dormitorios. Si no, al resumen.
                if (value === 'casa' || value === 'departamento') {
                    setCurrentStep(2);
                } else {
                    setCurrentStep(3); // Saltar a localidad y luego a resumen
                }
                break;
            case 2: // Location for casa/depto
                setSearchCriteria(prev => ({ ...prev, location: value }));
                setCurrentStep(3);
                break;
            case 3: // Bedrooms OR Location for others
                if (searchCriteria.propertyType === 'casa' || searchCriteria.propertyType === 'departamento') {
                     setSearchCriteria(prev => ({ ...prev, bedrooms: value }));
                } else {
                     setSearchCriteria(prev => ({ ...prev, location: value }));
                }
                setCurrentStep(4);
                break;
        }
    }, [searchCriteria]);

    const renderStepContent = () => {
        let title = '';
        let options: StepOptionData[] = [];
        let onSelect = (value: string) => {};

        switch (currentStep) {
            case 1:
                title = '¿Qué tipo de propiedad buscás?';
                options = PROPERTY_TYPES;
                onSelect = (value) => handleOptionSelect(1, value);
                break;
            case 2:
                title = '¿En qué localidad?';
                options = LOCATIONS;
                onSelect = (value) => handleOptionSelect(2, value);
                break;
            case 3:
                 if (searchCriteria.propertyType === 'casa' || searchCriteria.propertyType === 'departamento') {
                    title = '¿Cuántos dormitorios?';
                    options = BEDROOMS;
                } else {
                    title = '¿En qué localidad?';
                    options = LOCATIONS;
                }
                onSelect = (value) => handleOptionSelect(3, value);
                break;
            case 4:
                const searchUrl = getSearchUrl(searchCriteria);
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">¡Todo listo!</h2>
                        <p className="text-lg md:text-xl mb-6 text-gray-300">¡Vamos a buscar la propiedad ideal para vos!</p>
                        <div className="text-left bg-white/5 rounded-lg p-6 mb-8 text-base md:text-lg">
                            {Object.entries(searchCriteria).map(([key, value]) => {
                                if (!value) return null;
                                const typedKey = key as keyof SearchCriteria;
                                return (
                                     <p key={key} className="capitalize">
                                        <strong className="font-semibold">{keyTranslations[typedKey] || key}:</strong> {value}
                                    </p>
                                )
                            })}
                        </div>
                        <a 
                           href={searchUrl} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="bg-[rgb(238,64,55)] hover:bg-opacity-90 text-white font-bold py-3 px-8 rounded-lg text-xl transition-all transform hover:scale-105 inline-block"
                        >
                            Buscar Propiedades
                        </a>
                    </div>
                );
        }

        if (currentStep > 0 && currentStep < 4) {
             return (
                <div key={currentStep} className="w-full flex flex-col items-center animate-fade-in">
                    <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center">{title}</h3>
                    <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-4xl px-2">
                        {options.map(opt => (
                            <StepOption key={opt.id} label={opt.label} onClick={() => onSelect(opt.id)} />
                        ))}
                    </div>
                </div>
            );
        }
        return null;
    };
    
    const stepContent = useMemo(() => renderStepContent(), [currentStep, searchCriteria, handleOptionSelect]);

    return (
        <main className="w-screen h-screen bg-[rgb(13,30,40)] text-white overflow-hidden flex flex-col">
            <header className="p-4 flex justify-between items-center w-full shrink-0">
                <h1 className="text-2xl font-bold tracking-wider">ALMIRON PROPIEDADES</h1>
                 {activeOperation && (
                    <button onClick={resetSearch} className="bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20 transition-colors">
                        Empezar de nuevo
                    </button>
                 )}
            </header>
            <div className="w-full flex-grow flex flex-col overflow-hidden">
                <div className="flex-grow flex flex-col md:flex-row gap-0 md:gap-1">
                    <SearchPanel
                        title="Comprar"
                        imageUrl="https://picsum.photos/id/1062/1200/800"
                        onClick={() => handleOperationSelect('compra')}
                        isActive={activeOperation === 'compra'}
                        isShrunk={activeOperation === 'alquiler'}
                    >
                        {stepContent}
                    </SearchPanel>
                    <SearchPanel
                        title="Alquilar"
                        imageUrl="https://picsum.photos/id/10/1200/800"
                        onClick={() => handleOperationSelect('alquiler')}
                        isActive={activeOperation === 'alquiler'}
                        isShrunk={activeOperation === 'compra'}
                    >
                        {stepContent}
                    </SearchPanel>
                </div>
                <div className="flex flex-row h-16 md:h-[10%] shrink-0 gap-0 md:gap-1 mt-1 md:mt-1">
                   <div className={`transition-all duration-700 ease-in-out w-1/2 ${!activeOperation ? 'md:w-1/2' : (activeOperation === 'compra' ? 'md:w-[90%]' : 'md:w-[10%]')}`}>
                       <AppraisalButton title="Tasar para Vender" icon={<PropertyIcon />} isShrunk={activeOperation === 'alquiler'} />
                   </div>
                   <div className={`transition-all duration-700 ease-in-out w-1/2 ${!activeOperation ? 'md:w-1/2' : (activeOperation === 'alquiler' ? 'md:w-[90%]' : 'md:w-[10%]')}`}>
                       <AppraisalButton title="Tasar para Alquilar" icon={<KeyIcon />} isShrunk={activeOperation === 'compra'} />
                   </div>
                </div>
            </div>
        </main>
    );
};

export default App;