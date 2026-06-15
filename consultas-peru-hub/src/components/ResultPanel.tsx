import React, { useState } from 'react';
import { QueryType } from '../types';
import { 
  FileDown, 
  Copy, 
  Check, 
  Clock, 
  ShieldCheck, 
  Layers, 
  RefreshCw, 
  Info,
  Building,
  User,
  MapPin,
  Users,
  Search,
  BookOpen,
  Calendar,
  Globe,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const formatDob = (dobStr: string | undefined | null): string => {
  if (!dobStr) return "S/D";
  
  const cleaned = dobStr.trim();
  
  // 1. Matches DD/MM/YYYY or DD-MM-YYYY
  const ddmmyyyyRegex = /^(\d{2})[/-](\d{2})[/-](\d{4})$/;
  if (ddmmyyyyRegex.test(cleaned)) {
    return cleaned.replace(/-/g, '/');
  }

  // 2. Matches YYYY-MM-DD or YYYY/MM/DD
  const yyyymmddRegex = /^(\d{4})[/-](\d{2})[/-](\d{2})$/;
  const matchYmd = cleaned.match(yyyymmddRegex);
  if (matchYmd) {
    const [, year, month, day] = matchYmd;
    return `${day}/${month}/${year}`;
  }
  
  // 3. Matches general text-based Spanish pattern e.g., "13 de octubre de 1991"
  const textDobRegex = /^(\d{1,2})\s+de\s+([a-zA-ZñÑáéíóúÁÉÍÓÚ]+)\s+de\s+(\d{4})$/i;
  const matchText = cleaned.match(textDobRegex);
  if (matchText) {
    const day = matchText[1].padStart(2, '0');
    const monthText = matchText[2].toLowerCase();
    const year = matchText[3];
    
    const months: Record<string, string> = {
      enero: "01", feb: "02", febrero: "02", mar: "03", marzo: "03", abr: "04", abril: "04",
      may: "05", mayo: "05", jun: "06", junio: "06", jul: "07", julio: "07", ago: "08", agosto: "08",
      sep: "09", septiembre: "09", oct: "10", octubre: "10", nov: "11", noviembre: "11", dic: "12", diciembre: "12"
    };
    
    const monthVal = months[monthText] || "10";
    return `${day}/${monthVal}/${year}`;
  }

  return cleaned;
};

const calculateAge = (dobStr: string | undefined | null): string => {
  if (!dobStr) return "S/D";
  try {
    const cleaned = dobStr.trim();
    let year = 0;
    let month = 0;
    let day = 1;

    // 1. Matches YYYY-MM-DD or YYYY/MM/DD
    const yyyymmddRegex = /^(\d{4})[/-](\d{1,2})[/-](\d{1,2})$/;
    // 2. Matches DD/MM/YYYY or DD-MM-YYYY
    const ddmmyyyyRegex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;

    let match = cleaned.match(yyyymmddRegex);
    if (match) {
      year = parseInt(match[1], 10);
      month = parseInt(match[2], 10) - 1;
      day = parseInt(match[3], 10);
    } else {
      match = cleaned.match(ddmmyyyyRegex);
      if (match) {
        year = parseInt(match[3], 10);
        month = parseInt(match[2], 10) - 1;
        day = parseInt(match[1], 10);
      } else {
        const textDobRegex = /^(\d{1,2})\s+de\s+([a-zA-ZñÑáéíóúÁÉÍÓÚ]+)\s+de\s+(\d{4})$/i;
        const matchText = cleaned.match(textDobRegex);
        if (matchText) {
          day = parseInt(matchText[1], 10);
          year = parseInt(matchText[3], 10);
          const monthText = matchText[2].toLowerCase();
          const months: Record<string, number> = {
            enero: 0, febrero: 1, marzo: 2, abril: 3, mayo: 4, junio: 5,
            julio: 6, agosto: 7, septiembre: 8, octubre: 9, noviembre: 10, diciembre: 11
          };
          month = months[monthText] !== undefined ? months[monthText] : 9;
        } else {
          const parsed = new Date(cleaned);
          if (!isNaN(parsed.getTime())) {
            year = parsed.getFullYear();
            month = parsed.getMonth();
            day = parsed.getDate();
          } else {
            return "S/D";
          }
        }
      }
    }

    const today = new Date();
    let age = today.getFullYear() - year;
    const monthDiff = today.getMonth() - month;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < day)) {
      age--;
    }
    return age >= 0 ? `${age} años` : "S/D";
  } catch (e) {
    return "S/D";
  }
};

interface ResultPanelProps {
  type: QueryType;
  data: any;
  durationMs: number;
  source: string;
  language: 'es' | 'en';
  onAddNote?: (note: string) => void;
  onRefresh?: () => void;
}

export default function ResultPanel({ type, data, durationMs, source, language, onAddNote, onRefresh }: ResultPanelProps) {
  const [showJson, setShowJson] = useState(false);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState('');
  const [isNoteSaved, setIsNoteSaved] = useState(false);

  if (!data) return null;

  const t = {
    es: {
      results: "Resultados de la Consulta",
      searchSpeed: "Velocidad de Búsqueda",
      provider: "Fuente / Proveedor",
      notes: "Notas / Comentarios Personalizados",
      saveNote: "Guardar Nota",
      noteSaved: "Nota guardada en el historial",
      exportExcel: "Exportar Excel (CSV)",
      exportPdf: "Exportar Reporte (PDF)",
      copyJson: "Copiar JSON",
      copied: "Copiado!",
      viewRaw: "Ver JSON Original",
      hideRaw: "Ocultar JSON Original",
      origin: "Servicio Integrado",
      securedData: "Cifrado Extremo a Extremo (E2EE) Activado",
      generalData: "Datos Generales",
      location: "Ubicación Geográfica",
      identity: "Ficha Informativa",
      dniNumber: "DNI Número",
      fullName: "Nombres Completos",
      name: "Nombres",
      surname: "Apellidos",
      dob: "Fecha de Nacimiento",
      gender: "Género",
      age: "Edad",
      verCode: "Código Verificación (Seguridad)",
      ubigeo: "Código Ubigeo",
      address: "Dirección Registrada",
      estate: "Estado SUNAT",
      cond: "Condición del Contribuyente",
      activity: "Actividad Económica Principal",
      regDate: "Fecha de Inscripción",
      reason: "Razón Social",
      tradeName: "Nombre Comercial",
      dept: "Departamento",
      prov: "Provincia",
      dist: "Distrito",
      buy: "Monto Compra (SBS)",
      sell: "Monto Venta (SBS)",
      currency: "Moneda",
      date: "Fecha Efectiva",
      officeCode: "Código de Establecimiento",
      officeType: "Tipo de Establecimiento",
      officeActs: "Actividades del Establecimiento",
      repType: "Tipo Documento",
      repNum: "Número Documento",
      repName: "Nombre del Representante",
      repJob: "Cargo Registrado",
      repDate: "Fecha Desde",
      afpName: "Administradora AFP",
      afpFlow: "Comisión sobre Flujo (Sueldo)",
      afpMix: "Comisión Mixta (Flujo + Saldo)",
      afpInsurance: "Prima de Seguro",
      afpMax: "Toque de Remuneración",
      cpeStatus: "Estado del Comprobante",
      cpeIssuer: "RUC Emisor",
      cpeTypeRef: "Tipo de Documento",
      cpeSerieRef: "Serie",
      cpeNumRef: "Monto Facturado",
      cpeDateRef: "Fecha Emisión",
      cpeRes: "Estado CPE",
      cpeDomicile: "Estado Domicilio Emisor"
    },
    en: {
      results: "Query Results",
      searchSpeed: "Search Speed",
      provider: "Source / Provider",
      notes: "Custom Notes / Comments",
      saveNote: "Save Note",
      noteSaved: "Note saved to history",
      exportExcel: "Export Excel (CSV)",
      exportPdf: "Export Report (PDF)",
      copyJson: "Copy JSON",
      copied: "Copied!",
      viewRaw: "View Original JSON",
      hideRaw: "Hide Original JSON",
      origin: "Integrated Service",
      securedData: "End-to-End Encryption (E2EE) Enabled",
      generalData: "General Information",
      location: "Geographic Location",
      identity: "Information File",
      dniNumber: "DNI Number",
      fullName: "Full Name",
      name: "First Names",
      surname: "Surnames",
      dob: "Date of Birth",
      gender: "Gender",
      age: "Age",
      verCode: "Verification Code (Security)",
      ubigeo: "Ubigeo Code",
      address: "Registered Address",
      estate: "SUNAT Status",
      cond: "Taxpayer Condition",
      activity: "Business Activity",
      regDate: "Registration Date",
      reason: "Business Name",
      tradeName: "Trade Name",
      dept: "Department",
      prov: "Province",
      dist: "District",
      buy: "Buy Price (SBS)",
      sell: "Sell Price (SBS)",
      currency: "Currency",
      date: "Effective Date",
      officeCode: "Establishment Code",
      officeType: "Establishment Type",
      officeActs: "Establishment Activities",
      repType: "Document Type",
      repNum: "Document Number",
      repName: "Representative Name",
      repJob: "Registered Cargo",
      repDate: "Date Since",
      afpName: "AFP Company Name",
      afpFlow: "Flow Commission (Salary)",
      afpMix: "Mixed Commission (Flow + Fund)",
      afpInsurance: "Insurance Premium",
      afpMax: "Max Remuneration limit",
      cpeStatus: "Receipt Status",
      cpeIssuer: "Issuer RUC",
      cpeTypeRef: "Document Type",
      cpeSerieRef: "Serie",
      cpeNumRef: "Amount Billed",
      cpeDateRef: "Emission Date",
      cpeRes: "CPE Status",
      cpeDomicile: "Issuer Location Status"
    }
  }[language];

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNote = () => {
    if (onAddNote) {
      onAddNote(note);
      setIsNoteSaved(true);
      setTimeout(() => setIsNoteSaved(false), 3000);
    }
  };

  // CSV Generator (Export to Excel)
  const exportToExcel = () => {
    let headers: string[] = [];
    let rows: string[] = [];

    if (type === 'dni') {
      headers = ["DNI", "Nombres Completos", "Nombres", "Apellidos", "F. Nacimiento", "Género", "Ubigeo", "Dirección", "Dpto", "Prov", "Dist"];
      rows.push([
        data.number || '',
        data.full_name || '',
        data.name || '',
        data.surname || '',
        formatDob(data.date_of_birth),
        data.gender || '',
        data.ubigeo || '',
        data.address || '',
        data.department || '',
        data.province || '',
        data.district || ''
      ].map(v => `"${v}"`).join(","));
    } else if (type === 'ruc') {
      headers = ["RUC", "Razón Social", "Nombre Comercial", "Estado", "Condición", "Dirección", "Dpto", "Prov", "Dist", "Actividad"];
      rows.push([
        data.number || '',
        data.razon_social || '',
        data.nombre_comercial || '',
        data.estado || '',
        data.condicion || '',
        data.direccion || '',
        data.departamento || '',
        data.provincia || '',
        data.distrito || '',
        data.actividad_economica || ''
      ].map(v => `"${v}"`).join(","));
    } else if (type === 'exchange_rate') {
      headers = ["Fecha", "Compra", "Venta", "Moneda", "Origen"];
      rows.push([
        data.fecha || '',
        data.compra || '',
        data.venta || '',
        data.moneda || 'USD',
        data.origen || ''
      ].map(v => `"${v}"`).join(","));
    } else if (Array.isArray(data)) {
      // For arrays like establecimientos, representantes, afp
      if (type === 'establecimientos') {
        headers = ["Código", "Tipo", "Dirección", "Actividad", "Estado"];
        data.forEach(item => {
          rows.push([item.codigo || '', item.tipo || '', item.direccion || '', item.actividad || '', item.estado || ''].map(v => `"${v}"`).join(","));
        });
      } else if (type === 'representantes') {
        headers = ["Tipo Doc", "Nro Doc", "Nombre", "Cargo", "Fecha Desde"];
        data.forEach(item => {
          rows.push([item.tipo_documento || '', item.numero_documento || '', item.nombre || '', item.cargo || '', item.fecha_desde || ''].map(v => `"${v}"`).join(","));
        });
      } else if (type === 'afp') {
        headers = ["AFP", "Comisión Flujo", "Comisión Mixta", "Prima Seguro", "Remuneración Máxima"];
        data.forEach(item => {
          rows.push([item.afp || '', item.comision_flujo || '', item.comision_mixta || '', item.prima_seguro || '', item.remuneracion_maxima || ''].map(v => `"${v}"`).join(","));
        });
      }
    } else if (type === 'cpe') {
      headers = ["RUC Emisor", "Tipo CPE", "Serie", "Número", "F. Emisión", "Monto", "Estado CPE", "Domicilio"];
      rows.push([
        data.ruc_emisor || '',
        data.tipo_documento || '',
        data.serie || '',
        data.numero || '',
        data.fecha_emision || '',
        data.monto || '',
        data.estado_cpe || '',
        data.estado_domicilio || ''
      ].map(v => `"${v}"`).join(","));
    }

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + headers.join(",") + "\n" + rows.join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_${type}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Direct High-fidelity Print/PDF Engine
  const triggerPdfPrint = () => {
    window.print();
  };

  return (
    <div id="result-view-panel" className="bg-transparent border-0 transition-all duration-300 overflow-hidden shadow-none rounded-none">
      
      {/* Structured report detail values (Visual Layout of Image 2) */}
      <div className="p-6 printing-content">
        {type === 'dni' && (
          <div className="space-y-6">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.dniNumber}</span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.number}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 sm:col-span-2">
                    <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.fullName}</span>
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">{data.full_name}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.name}</span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.name}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.surname}</span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.surname}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.dob}</span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{formatDob(data.date_of_birth)}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.gender}</span>
                  <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.gender}</span>
                </div>
                <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.age}</span>
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{calculateAge(data.date_of_birth)}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.verCode}</span>
                    <span className="text-base font-bold font-mono text-emerald-500 dark:text-emerald-400 mt-0.5 block">{data.verification_code}</span>
                  </div>
                  <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                    <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.ubigeo}</span>
                    <span className="text-base font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.ubigeo}</span>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 rounded-lg text-center">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">{t.dept}</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-350 block mt-1">{data.department}</span>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 rounded-lg text-center">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">{t.prov}</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-350 block mt-1">{data.province}</span>
                </div>
                <div className="p-3 bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 rounded-lg text-center">
                  <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-medium">{t.dist}</span>
                  <span className="font-semibold text-zinc-700 dark:text-zinc-350 block mt-1">{data.district}</span>
                </div>
              </div>
              <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 mt-4">
                <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.address}</span>
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.address || "S/D"}</span>
              </div>
            </div>
          </div>
        )}

        {type === 'ruc' && (
          <div className="space-y-6">
            <div>
              <h6 className="text-[11px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider mb-2.5">{t.generalData}</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 font-mono">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">NUMERO RUC</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.number}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 sm:col-span-2">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.reason}</span>
                  <span className="text-base font-bold text-blue-600 dark:text-blue-400 mt-0.5 block">{data.razon_social}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.tradeName}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.nombre_comercial || 'S/D'}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.regDate}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.fecha_inscripcion || 'S/D'}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.estate}</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 rounded mt-1.5 inline-block">{data.estado}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.cond}</span>
                  <span className="text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded mt-1.5 inline-block">{data.condicion}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 sm:col-span-2">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.activity}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.actividad_economica}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 sm:col-span-2">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.address}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.direccion}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {type === 'exchange_rate' && (
          <div className="space-y-6">
            <div>
              <h6 className="text-[11px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider mb-2.5">{t.generalData}</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40 text-center">
                  <span className="text-zinc-400 dark:text-zinc-500 text-xs block uppercase font-semibold">{t.buy}</span>
                  <span className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-2 block font-mono">S/. {data.compra}</span>
                </div>
                <div className="p-5 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/40 text-center">
                  <span className="text-zinc-400 dark:text-zinc-500 text-xs block uppercase font-semibold">{t.sell}</span>
                  <span className="text-4xl font-extrabold text-rose-500 dark:text-rose-450 mt-2 block font-mono">S/. {data.venta}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 text-center">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.currency}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.moneda}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 text-center">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.date}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.fecha}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Arrays like establecimientos, representantes, afp list layouts */}
        {type === 'establecimientos' && Array.isArray(data) && (
          <div className="space-y-4">
            <h6 className="text-[11px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider mb-2">{t.generalData} ({data.length})</h6>
            <div className="space-y-3">
              {data.map((item, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 py-0.5 px-2 rounded font-bold">N° {item.codigo}</span>
                      <span className="text-xs font-bold text-blue-600 dark:text-blue-400">{item.tipo}</span>
                    </div>
                    <p className="text-sm font-medium text-zinc-800 dark:text-zinc-200">{item.direccion}</p>
                    <p className="text-xs text-zinc-400 dark:text-zinc-500">{item.actividad}</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-950/55 text-emerald-600 dark:text-emerald-400 py-1 px-3 rounded-full">{item.estado}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'representantes' && Array.isArray(data) && (
          <div className="space-y-4">
            <h6 className="text-[11px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider mb-2">{t.generalData} ({data.length})</h6>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-zinc-200 dark:border-zinc-850 bg-zinc-100 dark:bg-zinc-950 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">
                    <th className="py-2.5 px-3 rounded-l-lg">{t.repType}</th>
                    <th className="py-2.5 px-3">{t.repNum}</th>
                    <th className="py-2.5 px-3">{t.repName}</th>
                    <th className="py-2.5 px-3">{t.repJob}</th>
                    <th className="py-2.5 px-3 rounded-r-lg">{t.repDate}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800/60">
                  {data.map((item, idx) => (
                    <tr key={idx} className="hover:bg-zinc-50/50 dark:hover:bg-zinc-950/30">
                      <td className="py-3 px-3 font-mono text-xs">{item.tipo_documento}</td>
                      <td className="py-3 px-3 font-mono text-xs">{item.numero_documento}</td>
                      <td className="py-3 px-3 font-bold text-blue-600 dark:text-blue-400">{item.nombre}</td>
                      <td className="py-3 px-3 text-xs font-semibold text-zinc-700 dark:text-zinc-300">{item.cargo}</td>
                      <td className="py-3 px-3 text-xs font-mono">{item.fecha_desde}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {type === 'afp' && Array.isArray(data) && (
          <div className="space-y-4">
            <h6 className="text-[11px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider mb-2">{t.generalData}</h6>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {data.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 flex flex-col justify-between">
                  <div className="border-b border-zinc-200 dark:border-zinc-850 pb-2.5 mb-2.5">
                    <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.afpName}</span>
                    <span className="text-lg font-bold text-zinc-900 dark:text-zinc-100 flex items-center justify-between mt-1">
                      {item.afp}
                      <span className="w-2.5 h-2.5 bg-blue-500 rounded-full"></span>
                    </span>
                  </div>
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex justify-between">
                      <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block">{t.afpFlow}</span>
                      <span className="font-semibold">{item.comision_flujo}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block">{t.afpMix}</span>
                      <span className="font-semibold">{item.comision_mixta}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block">{t.afpInsurance}</span>
                      <span className="font-semibold text-red-500">{item.prima_seguro}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block">{t.afpMax}</span>
                      <span className="font-semibold text-emerald-500">{item.remuneracion_maxima}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {type === 'cpe' && (
          <div className="space-y-6">
            <div>
              <h6 className="text-[11px] uppercase font-bold text-zinc-400 dark:text-zinc-500 tracking-wider mb-2.5">{t.cpeStatus}</h6>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.cpeIssuer}</span>
                  <span className="text-sm font-semibold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.ruc_emisor}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.cpeTypeRef}</span>
                  <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.tipo_documento}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.cpeSerieRef}</span>
                  <span className="text-sm font-bold font-mono text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.serie}-{data.numero}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.cpeNumRef}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block font-mono text-blue-600 dark:text-blue-400">S/. {data.monto}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.cpeDateRef}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.fecha_emision}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.cpeRes}</span>
                  <span className="text-xs font-bold px-2.5 py-1 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-450 rounded mt-1.5 inline-block">✓ {data.estado_cpe}</span>
                </div>
                <div className="p-3.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/40 sm:col-span-2">
                  <span className="text-zinc-400 dark:text-zinc-500 text-[10px] block uppercase font-medium">{t.cpeDomicile}</span>
                  <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 mt-0.5 block">{data.estado_domicilio}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Latency and Encryption details moved to the bottom */}
      <div className="px-6 py-3 bg-blue-50/40 dark:bg-blue-950/20 border-t border-b border-zinc-200 dark:border-zinc-800/80 flex flex-wrap justify-between items-center text-xs gap-4">
        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
          <Clock className="w-3.5 h-3.5" />
          <span className="font-semibold">{t.searchSpeed}:</span>
          <span className="font-mono bg-blue-100/50 dark:bg-blue-950/80 px-1.5 py-0.5 rounded font-bold">{durationMs}ms</span>
        </div>
        <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>{t.securedData}</span>
        </div>
      </div>

      {/* Banner & Actions section moved to the bottom */}
      <div className="bg-zinc-50 dark:bg-zinc-950 p-4 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-blue-100 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
            {type === 'dni' && <User className="w-5 h-5" />}
            {type === 'ruc' && <Building className="w-5 h-5" />}
            {type === 'exchange_rate' && <Globe className="w-5 h-5" />}
            {type === 'establecimientos' && <MapPin className="w-5 h-5" />}
            {type === 'representantes' && <Users className="w-5 h-5" />}
            {type === 'afp' && <Layers className="w-5 h-5" />}
            {type === 'cpe' && <BookOpen className="w-5 h-5" />}
          </div>
          <div>
            <h5 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{t.results}</h5>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-mono lower py-0.5 px-1.5 rounded bg-zinc-200/50 dark:bg-zinc-800/50 mt-1 inline-block">
              {source === 'api_produccion' ? '📡 PRODUCCIÓN' : '🔌 CONTINGENCIA SUNAT/RENIEC'}
            </span>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2">
          <button id="btn-export-excel" onClick={exportToExcel} className="p-2 text-zinc-500 hover:text-emerald-600 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors" title={t.exportExcel}>
            <FileDown className="w-4 h-4" />
          </button>
          <button id="btn-export-pdf" onClick={triggerPdfPrint} className="p-2 text-zinc-500 hover:text-red-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors" title={t.exportPdf}>
            <Calendar className="w-4 h-4" />
          </button>
          <button id="btn-copy-json" onClick={handleCopy} className="p-2 text-zinc-500 hover:text-blue-500 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors" title={t.copyJson}>
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Customizable Note / Action log input (matches "historial personalizable") */}
      {onAddNote && (
        <div className="p-6 bg-zinc-50 dark:bg-zinc-950/50 border-t border-zinc-200 dark:border-zinc-850 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full">
            <label className="text-xs font-bold text-zinc-400 dark:text-zinc-500 block mb-1.5 uppercase tracking-wide">
              {t.notes}
            </label>
            <input
              id="custom-result-notes"
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={language === 'es' ? "Añadir descripción o etiqueta personalizada..." : "Add a custom label or description..."}
              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <button
            id="btn-save-note"
            onClick={handleSaveNote}
            className="w-full md:w-auto px-4 py-2 bg-zinc-200 hover:bg-zinc-300 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-lg text-xs font-bold whitespace-nowrap cursor-pointer transition-colors"
          >
            {isNoteSaved ? t.noteSaved : t.saveNote}
          </button>
        </div>
      )}

      {/* Raw JSON Accordion for Image 3 feeling */}
      <div className="border-t border-zinc-200 dark:border-zinc-850">
        <button
          id="btn-toggle-json"
          onClick={() => setShowJson(!showJson)}
          className="w-full px-6 py-4 flex items-center justify-between text-xs font-medium text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-950 cursor-pointer transition-colors"
        >
          <span className="flex items-center gap-1.5 font-mono">
            {"{ }"} {showJson ? t.hideRaw : t.viewRaw}
          </span>
          {showJson ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showJson && (
          <div className="bg-zinc-950 p-4 border-t border-zinc-900 text-zinc-300 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-96">
            <pre id="raw-json-output">{JSON.stringify(data, null, 2)}</pre>
          </div>
        )}
      </div>

    </div>
  );
}
