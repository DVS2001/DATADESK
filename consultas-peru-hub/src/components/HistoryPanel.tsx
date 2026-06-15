import React, { useState } from 'react';
import { SearchHistory, QueryType } from '../types';
import { Trash2, ExternalLink, Calendar, Search, Tag, Database, RefreshCw, X } from 'lucide-react';

interface HistoryPanelProps {
  history: SearchHistory[];
  onDeleteRecord: (id: string) => void;
  onClearAll: () => void;
  onReRunQuery: (type: QueryType, term: string) => void;
  language: 'es' | 'en';
}

export default function HistoryPanel({ history, onDeleteRecord, onClearAll, onReRunQuery, language }: HistoryPanelProps) {
  const [filterType, setFilterType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  const t = {
    es: {
      title: "Historial de Búsquedas Personalizado",
      searchHint: "Buscar por número o notas...",
      filterAll: "Todos los Tipos",
      clearAll: "Vaciar Historial",
      emptyHistory: "Aún no se registran búsquedas en su cuenta.",
      reRun: "Re-consultar",
      delete: "Eliminar",
      notes: "Notas:",
      noNotes: "Sin notas",
      duration: "Duración:",
      totalQueries: "Consultas Integradas"
    },
    en: {
      title: "Custom Search History Log",
      searchHint: "Search by number or notes...",
      filterAll: "All Document Types",
      clearAll: "Clear All History",
      emptyHistory: "No search queries have been recorded yet.",
      reRun: "Re-query",
      delete: "Delete",
      notes: "Notes:",
      noNotes: "No custom notes",
      duration: "Duration:",
      totalQueries: "Integrated Queries"
    }
  }[language];

  // Filters logic
  const filteredHistory = history.filter(item => {
    const matchesType = filterType === 'ALL' || item.type === filterType;
    const matchesSearch = 
      item.queryParam.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.data?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.data?.razon_social?.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesType && matchesSearch;
  });

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 transition-colors duration-300 shadow-sm space-y-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h4 className="text-md font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Database className="w-5 h-5 text-blue-500" />
            {t.title}
          </h4>
          <p className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">
            Sincronizado en tiempo real cifrado con la nube (E2EE)
          </p>
        </div>
        {history.length > 0 && (
          <button
            id="clear-all-history-btn"
            onClick={onClearAll}
            className="text-xs font-bold text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-950/20 px-3 py-1.5 rounded-lg border border-red-100 dark:border-red-900/30 font-medium cursor-pointer transition-colors"
          >
            {t.clearAll}
          </button>
        )}
      </div>

      {/* Filter and search controls */}
      <div className="pt-2">
        <div className="relative">
          <input
            id="search-history-query"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t.searchHint}
            className="w-full pl-9 pr-4 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs bg-zinc-50 dark:bg-zinc-950 text-zinc-940 focus:outline-none dark:text-zinc-100 font-medium"
          />
          <Search className="absolute left-3 top-3 w-3.5 h-3.5 text-zinc-400" />
        </div>
      </div>

      {/* History table list */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 bg-zinc-50 dark:bg-zinc-950 rounded-lg border border-dashed border-zinc-200 dark:border-zinc-800">
            <Database className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="text-xs text-zinc-400 dark:text-zinc-500">{t.emptyHistory}</p>
          </div>
        ) : (
          filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-blue-400 dark:hover:border-blue-600 transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase font-mono ${
                    item.type === 'dni' ? 'bg-blue-100 text-blue-700 dark:bg-blue-950/55 dark:text-blue-400' :
                    item.type === 'ruc' ? 'bg-purple-100 text-purple-700 dark:bg-purple-950/55 dark:text-purple-400' :
                    'bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                  }`}>
                    {item.type === 'exchange_rate' ? 'Rate' : item.type.toUpperCase()}
                  </span>
                  <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 font-mono">
                    {item.queryParam.split("-")[0]} {/* Hide excessive CPE elements in title */}
                  </span>
                  {item.data?.full_name && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold max-w-48 truncate">
                      - {item.data.full_name}
                    </span>
                  )}
                  {item.data?.razon_social && (
                    <span className="text-xs text-zinc-400 dark:text-zinc-500 font-semibold max-w-48 truncate">
                      - {item.data.razon_social}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-zinc-400 font-medium">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.timestamp).toLocaleString()}
                  </span>
                  <span>
                    {t.duration} <span className="font-mono text-zinc-653">{item.durationMs}ms</span>
                  </span>
                </div>

                {/* Tags or notes custom section */}
                <div className="flex items-center gap-1.5 pt-1 text-[11px] font-medium text-blue-600 dark:text-blue-400">
                  <Tag className="w-3 h-3" />
                  <span className="italic">{item.notes || t.noNotes}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 pt-2.5 md:pt-0">
                <button
                  id={`rerun-history-${item.id}`}
                  onClick={() => onReRunQuery(item.type, item.queryParam)}
                  className="px-2.5 py-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded cursor-pointer transition-colors font-semibold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 w-3" />
                  {t.reRun}
                </button>
                <button
                  id={`delete-history-${item.id}`}
                  onClick={() => onDeleteRecord(item.id)}
                  className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded cursor-pointer transition-colors"
                  title={t.delete}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
