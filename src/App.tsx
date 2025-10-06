import React, { useState, useCallback, useMemo } from 'react';
import SearchPanel from './components/SearchPanel';
import StepOption from './components/StepOption';
import AppraisalButton from './components/AppraisalButton';
import LoteoCard from './components/LoteoCard';
import { PROPERTY_TYPES, LOCATIONS, BEDROOMS } from './constants';
import { LOTEOS_DATA } from './loteosData';
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
    isMortgageCredit: 'Apta para Crédito',
};


const App: React.FC = () => {
    const [activeOperation, setActiveOperation] = useState<Operation | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [buyFlow, setBuyFlow] = useState<'inmuebles' | 'loteos' | null>(null);
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
        operation: null,
        propertyType: null,
        location: null,
        bedrooms: null,
        isMortgageCredit: null,
    });

    const resetSearch = useCallback(() => {
        setActiveOperation(null);
        setCurrentStep(0);
        setBuyFlow(null);
        setSearchCriteria({
            operation: null,
            propertyType: null,
            location: null,
            bedrooms: null,
            isMortgageCredit: null,
        });
    }, []);

    const handleOperationSelect = useCallback((operation: Operation) => {
        setActiveOperation(operation);
        setSearchCriteria(prev => ({ ...prev, operation, isMortgageCredit: null })); 
        if (operation === 'compra') {
            setCurrentStep(1); 
        } else {
            setCurrentStep(2); 
        }
    }, []);

    const handleBuyFlowSelect = useCallback((flow: 'inmuebles' | 'loteos') => {
        setBuyFlow(flow);
        if (flow === 'inmuebles') {
            setCurrentStep(1.5); // Go to mortgage question
        } else {
            setCurrentStep(100); // Go to loteos grid
        }
    }, []);
    
    const handleMortgageSelect = useCallback((isCredit: boolean) => {
        setSearchCriteria(prev => ({ ...prev, isMortgageCredit: isCredit }));
        setCurrentStep(2); // Go to property type step
    }, []);

    const handleOptionSelect = useCallback((step: number, value: string) => {
        switch (step) {
            case 2: // Property Type
                const newCriteria = { ...searchCriteria, propertyType: value };
                setSearchCriteria(newCriteria);
                if (value === 'casa' || value === 'departamento') {
                    setCurrentStep(3);
                } else {
                    setCurrentStep(4);
                }
                break;
            case 3: // Location for casa/depto
                setSearchCriteria(prev => ({ ...prev, location: value }));
                setCurrentStep(4);
                break;
            case 4: // Bedrooms OR Location for others
                if (searchCriteria.propertyType === 'casa' || searchCriteria.propertyType === 'departamento') {
                     setSearchCriteria(prev => ({ ...prev, bedrooms: value }));
                } else {
                     setSearchCriteria(prev => ({ ...prev, location: value }));
                }
                setCurrentStep(5);
                break;
        }
    }, [searchCriteria]);

    const renderStepContent = () => {
        let title = '';
        let options: StepOptionData[] = [];
        let onSelect: (value: string) => void;

        switch (currentStep) {
            case 1:
                return (
                    <div key="buy-flow-step" className="w-full flex flex-col items-center animate-fade-in">
                        <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center">¿Qué estás buscando?</h3>
                        <div className="flex flex-col md:flex-row justify-center gap-4 w-full max-w-2xl px-2">
                            <StepOption label="Loteos" onClick={() => handleBuyFlowSelect('loteos')} />
                            <StepOption label="Inmuebles" onClick={() => handleBuyFlowSelect('inmuebles')} />
                        </div>
                    </div>
                )
            case 1.5:
                 return (
                     <div key="mortgage-step" className="w-full flex flex-col items-center animate-fade-in">
                        <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center">¿Buscás que la propiedad sea apta para crédito hipotecario?</h3>
                        <div className="flex flex-wrap justify-center gap-2 md:gap-3 w-full max-w-lg px-2">
                           <StepOption label="Sí" onClick={() => handleMortgageSelect(true)} />
                           <StepOption label="No" onClick={() => handleMortgageSelect(false)} />
                        </div>
                    </div>
                )
            case 2:
                title = '¿Qué tipo de propiedad buscás?';
                options = searchCriteria.isMortgageCredit === true 
                    ? PROPERTY_TYPES.filter(p => p.id === 'casa' || p.id === 'departamento')
                    : PROPERTY_TYPES;
                onSelect = (value) => handleOptionSelect(2, value);
                break;
            case 3:
                title = '¿En qué localidad?';
                options = LOCATIONS;
                onSelect = (value) => handleOptionSelect(3, value);
                break;
            case 4:
                 if (searchCriteria.propertyType === 'casa' || searchCriteria.propertyType === 'departamento') {
                    title = '¿Cuántos dormitorios?';
                    options = BEDROOMS;
                } else {
                    title = '¿En qué localidad?';
                    options = LOCATIONS;
                }
                onSelect = (value) => handleOptionSelect(4, value);
                break;
            case 5:
                const searchUrl = getSearchUrl(searchCriteria);
                return (
                    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">¡Todo listo!</h2>
                        <p className="text-lg md:text-xl mb-6 text-gray-300">¡Vamos a buscar la propiedad ideal para vos!</p>
                        <div className="text-left bg-white/5 rounded-lg p-6 mb-8 text-base md:text-lg">
                            {Object.entries(searchCriteria)
                                .filter(([, value]) => value !== null)
                                .map(([key, value]) => {
                                    const typedKey = key as keyof SearchCriteria;
                                    let displayValue: string;

                                    if (key === 'isMortgageCredit') {
                                        if (searchCriteria.operation !== 'compra') return null;
                                        displayValue = value ? 'Sí' : 'No';
                                    } else {
                                        displayValue = String(value);
                                    }
                                    
                                    return (
                                        <p key={key} className="capitalize">
                                            <strong className="font-semibold">{keyTranslations[typedKey] || key}:</strong> {displayValue}
                                        </p>
                                    );
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
             case 100:
                return (
                    <div key="loteos-step" className="w-full flex flex-col items-center animate-fade-in overflow-y-auto">
                        <h3 className="text-2xl md:text-3xl font-semibold mb-8 text-center">Conocé nuestros Loteos</h3>
                        <div className="grid grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl px-2 pb-4">
                            {LOTEOS_DATA.map(loteo => (
                                <LoteoCard key={loteo.id} name={loteo.name} imageUrl={loteo.imageUrl} url={loteo.url} />
                            ))}
                        </div>
                    </div>
                );
        }

        if (currentStep > 1 && currentStep < 5) {
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
    
    const stepContent = useMemo(() => renderStepContent(), [currentStep, searchCriteria, handleOptionSelect, handleMortgageSelect, handleBuyFlowSelect]);

    return (
        <main className="w-screen h-screen bg-[rgb(13,30,40)] text-white overflow-hidden flex flex-col">
            <div className="w-full flex-grow flex flex-col overflow-hidden">
                <div className="flex-grow flex flex-col md:flex-row gap-0 md:gap-1">
                    <SearchPanel
                        title="Comprar"
                        imageUrl="https://images.unsplash.com/photo-1729855637715-99192904aac5"
                        onClick={() => handleOperationSelect('compra')}
                        isActive={activeOperation === 'compra'}
                        isShrunk={activeOperation === 'alquiler'}
                        onReset={resetSearch}
                    >
                        {stepContent}
                    </SearchPanel>
                    <SearchPanel
                        title="Alquilar"
                        imageUrl="https://images.unsplash.com/photo-1758523671893-0ba21cf4260f"
                        onClick={() => handleOperationSelect('alquiler')}
                        isActive={activeOperation === 'alquiler'}
                        isShrunk={activeOperation === 'compra'}
                        onReset={resetSearch}
                    >
                        {stepContent}
                    </SearchPanel>
                </div>
                <div className="flex flex-row h-16 md:h-[10%] shrink-0 gap-0 md:gap-1 mt-1 md:mt-1">
                   <div className={`transition-all duration-700 ease-in-out w-1/2 ${!activeOperation ? 'md:w-1/2' : (activeOperation === 'compra' ? 'md:w-[90%]' : 'md:w-[10%]')}`}>
                       <AppraisalButton 
                           title="Tasar para Vender" 
                           icon={<PropertyIcon />} 
                           isShrunk={activeOperation === 'alquiler'}
                           url="https://almironpropiedades.com.ar/tasaciones"
                        />
                   </div>
                   <div className={`transition-all duration-700 ease-in-out w-1/2 ${!activeOperation ? 'md:w-1/2' : (activeOperation === 'alquiler' ? 'md:w-[90%]' : 'md:w-[10%]')}`}>
                       <AppraisalButton 
                           title="Tasar para Alquilar" 
                           icon={<KeyIcon />} 
                           isShrunk={activeOperation === 'compra'}
                           url="https://almironpropiedades.com.ar/tasaciones"
                        />
                   </div>
                </div>
            </div>
        </main>
    );
};

export default App;
