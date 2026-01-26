export interface CotizacionItem {
  //no se muestra
  id: string;
  produccion: string;
  //color: string;
  
  //ids
  tipoEnvioId: string;
  produccionId: string;
  canteraId: string;
  tipoBloqueId: string;

  //se muestra en la lista de cotizaciones
  item:string;
  descripcion:string;
  tipoEnvio: string;
  cantera: string;
  tipoBloque: string;
  embalaje: string;
  unidadMedida:string;
  cantidad: number;

  //se guarda
  ancho:number;
  largo:number;
  espesor:number;
  exnFab: string;
  flete: string;
  costoInicial: number;
  costoMateriaPrima: number;

  procesosIds:string[];
}
