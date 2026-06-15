export type QueryType = 'dni' | 'ruc' | 'exchange_rate' | 'establecimientos' | 'representantes' | 'afp' | 'cpe';

export interface SearchHistory {
  id: string;
  userId: string;
  type: QueryType;
  queryParam: string;
  timestamp: string;
  success: boolean;
  durationMs: number;
  data: any;
  notes?: string;
}

export interface UserSession {
  id: string;
  email: string;
  name: string;
  token?: string;
  createdAt: string;
}

export interface RealTimeNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'info' | 'warning' | 'success';
}

export interface QueryStats {
  total: number;
  successCount: number;
  failureCount: number;
  avgDurationMs: number;
  byType: Record<QueryType, number>;
}

export interface DniData {
  number: string;
  full_name: string;
  name: string;
  surname: string;
  verification_code: string;
  date_of_birth: string;
  gender: string;
  first_last_name: string;
  second_last_name: string;
  department: string;
  province: string;
  district: string;
  address: string;
  ubigeo: string;
}

export interface RucData {
  number: string;
  razon_social: string;
  nombre_comercial: string;
  estado: string;
  condicion: string;
  direccion: string;
  departamento: string;
  provincia: string;
  distrito: string;
  ubigeo: string;
  fecha_inscripcion: string;
  actividad_economica: string;
}

export interface ExchangeRateData {
  fecha: string;
  compra: number;
  venta: number;
  moneda: string;
  origen: string;
}

export interface EstablecimientoAnexoData {
  codigo: string;
  tipo: string;
  direccion: string;
  actividad: string;
  estado: string;
}

export interface RucRepresentanteData {
  tipo_documento: string;
  numero_documento: string;
  nombre: string;
  cargo: string;
  fecha_desde: string;
}

export interface AfpData {
  afp: string;
  comision_flujo: string;
  comision_mixta: string;
  prima_seguro: string;
  remuneracion_maxima: string;
}

export interface CpeData {
  ruc_emisor: string;
  tipo_documento: string;
  serie: string;
  numero: string;
  fecha_emision: string;
  monto: string;
  estado_cpe: string;
  estado_domicilio: string;
}
