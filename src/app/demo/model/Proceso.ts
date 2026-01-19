export interface Proceso {
  id: string;
  nombre: string;
  valor: number;
  hijos?: Proceso[];
}
