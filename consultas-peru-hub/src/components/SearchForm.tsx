import React, { useState, useEffect } from 'react';
import { QueryType } from '../types';
import { Search, Loader2, AlertCircle, Info } from 'lucide-react';

interface SearchFormProps {
  activeTab: QueryType;
  onSearch: (params: { type_document: string; document_number: string; additionalParams?: any }) => void;
  isLoading: boolean;
  language: 'es' | 'en';
  token: string;
}

export default function SearchForm({ activeTab, onSearch, isLoading, language, token }: SearchFormProps) {
  const [inputValue, setInputValue] = useState(''); // Empty initial state as guide only
  const [validationError, setValidationError] = useState('');

  // Translations
  const t = {
    es: {
      search: "Buscar",
      searching: "Transmitiendo...",
      placeholderDni: "Ingrese el DNI (8 dígitos)",
      required: "Este campo es requerido",
      errorDni: "El DNI debe contener exactamente 8 dígitos numéricos",
      validationValid: "Formato de DNI válido",
      example: "Ejemplo: ",
      tokenNotice: "Usando token seguro del sistema DNI.",
      configuratorTitle: "Consultar Ciudadano por DNI",
      presetsLabel: "Consultas rápidas de prueba (DNI):"
    },
    en: {
      search: "Search",
      searching: "Querying...",
      placeholderDni: "Enter DNI (8 digits)",
      required: "This field is required",
      errorDni: "DNI must be exactly 8 numerical digits",
      validationValid: "DNI format valid",
      example: "Example: ",
      tokenNotice: "Using secure system DNI token.",
      configuratorTitle: "Verify Citizen DNI",
      presetsLabel: "Quick Developer Presets (DNI):"
    }
  }[language];

  // Sync state if activeTab changes (should only be 'dni' anyway)
  useEffect(() => {
    setValidationError('');
  }, [activeTab]);

  // Handle live DNI validation
  const handleLiveValidate = (val: string) => {
    // Only allow numbers
    const cleanVal = val.replace(/\D/g, '').slice(0, 8);
    setInputValue(cleanVal);
    
    if (!cleanVal) {
      setValidationError('');
      return;
    }

    if (cleanVal.length !== 8) {
      setValidationError(t.errorDni);
    } else {
      setValidationError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.length !== 8 || !/^[0-9]+$/.test(inputValue)) {
      setValidationError(t.errorDni);
      return;
    }

    setValidationError('');
    onSearch({
      type_document: 'dni',
      document_number: inputValue
    });
  };

  const loadPreset = (preset: string) => {
    handleLiveValidate(preset);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-zinc-200 dark:border-zinc-800 transition-all duration-300 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <h4 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Info className="w-4 h-4 text-blue-500" />
          {t.configuratorTitle}
        </h4>
        <span className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded max-w-max">
          {t.tokenNotice}
        </span>
      </div>

      <div className="space-y-5">
        <div className={`relative rounded-lg border transition-all ${
          validationError 
            ? 'border-red-500 ring-2 ring-red-200/50 dark:ring-red-900/20' 
            : 'border-zinc-200 dark:border-zinc-800 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500'
        } bg-zinc-50 dark:bg-zinc-950`}>
          {/* Background zeros guide layer */}
          <div className="absolute inset-y-0 left-0 right-0 px-4 flex items-center pointer-events-none select-none font-mono text-xl tracking-[0.2em] font-bold">
            <span className="text-transparent">{inputValue}</span>
            <span className="text-zinc-400/50 dark:text-zinc-600/50">
              {"00000000".slice(inputValue.length)}
            </span>
          </div>

          <input
            id="query-input-field"
            type="text"
            pattern="[0-9]*"
            inputMode="numeric"
            maxLength={8}
            value={inputValue}
            onChange={(e) => handleLiveValidate(e.target.value)}
            disabled={isLoading}
            className="w-full px-4 py-3.5 bg-transparent text-xl font-mono tracking-[0.2em] font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none"
          />
        </div>
        {validationError && (
          <div className="flex items-center gap-1.5 mt-2 text-xs text-red-500 font-medium animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{validationError}</span>
          </div>
        )}
        {!validationError && inputValue.length === 8 && (
          <p className="text-xs text-emerald-500 font-medium mt-1.5 flex items-center gap-1">
            ✓ {t.validationValid}
          </p>
        )}


      </div>

      {/* Action triggers */}
      <button
        id="search-button-submit"
        type="submit"
        disabled={isLoading || inputValue.length !== 8}
        className={`w-full mt-6 py-3 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
          isLoading || inputValue.length !== 8
            ? 'bg-blue-300 dark:bg-blue-900/50 text-blue-100 dark:text-zinc-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white shadow-md active:scale-[0.98]'
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>{t.searching}</span>
          </>
        ) : (
          <>
            <Search className="w-4 h-4 text-white" />
            <span>{t.search} DNI ({inputValue || '________'})</span>
          </>
        )}
      </button>
    </form>
  );
}
