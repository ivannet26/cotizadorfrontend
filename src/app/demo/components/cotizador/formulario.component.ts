import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TreeModule } from 'primeng/tree';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';
import { Proceso } from '../../model/Proceso';
import { Produccion } from '../../model/Produccion';
import { Opcion } from '../../model/Opcion';
import { TipoEnvio } from '../../model/TipoEnvio';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CotizacionesService } from '../../service/cotizaciones.service';
import { CotizacionItem } from '../../model/CotizacionItem';
import { ActivatedRoute } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';

// llaves para checkbox embalaje
type EmbalajeKey = 'java' | 'carton' | 'cajaMadera' | 'caballete';

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TreeModule,
    InputTextModule,
    FieldsetModule,
    PanelModule,
    CheckboxModule,
    ButtonModule,
    ToastModule
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css',
  providers: [ConfirmationService, MessageService]
})


export class FormularioComponent implements OnInit {

  // Dropdown Produccion
  producciones: Produccion[] = [];
  
  // Dropdowns Materia Prima
  canteras: Opcion[] = [];
  tipos: Opcion[] = [];
  colores:Opcion[]=[];
  embalajes:Opcion[]=[]
  tiposEnvio: TipoEnvio[] = [];
  editId:string|null=null;


  //Checkbox Tree
  treeNodes:TreeNode[]=[
    {
      label:'Procesos',
      key: 'procesos',
      expanded: true,
      children:[
      { label: 'Corte', key: '01' },
      { label: 'Desdoblado', key: '02' },
      { label: 'Calibrado', key: '03' },
      { label: 'Estucado', key: '04' },
      { label: 'MOSAICOS-RUMI SERVICIO', key: '09' },
      { label: 'CALIBRADO PLANCHA', key: '10' },
      { label: 'ESTUCADO PLANCHA', key: '11' },
      { label: 'PUENTE FRESA', key: '12' },
      { label: 'Seleccione y Empaque', key: '13' },
      { label: 'MOSAICO - RUMI PRODUCCION', key: '14' },
      { label: 'CORTE-TELAR', key: '15' },

      {
        label:'Línea',
        key:'linea',
        expanded: true,
        children:[
          { label: 'Multidisco', key: '05' },
          { label: 'Pulido', key: '06' },
          { label: 'Borde', key: '07' },
          { label: 'Seleccione y Empaque', key: '08' },
        ]
      }
      ]
    }
  ];

  // Nodos seleccionados
  selectedNodes:TreeNode[]=[]; 

  unidadesCantidad = [
    { label: 'mt2', value: 'mt2' },
    { label: 'cm', value: 'cm' }
  ];


  formGroup = new FormGroup({
    
    //primer bloque
    cantidad: new FormControl<string>('', { nonNullable: true }),
    unidadCantidad: new FormControl<string>('mt2', { nonNullable: true }),
    ancho: new FormControl<string>('', { nonNullable: true }),
    unidadAncho: new FormControl<string>({ value: 'cm', disabled: true } as any, { nonNullable: true }),
    largo: new FormControl<string>('', { nonNullable: true }),
    unidadLargo: new FormControl<string>({ value: 'cm', disabled: true } as any, { nonNullable: true }),
    espesor: new FormControl<string>('', { nonNullable: true }),
    unidadEspesor: new FormControl<string>({ value: 'cm', disabled: true } as any, { nonNullable: true }),

    //columna izquierda
    produccionElegida: new FormControl<Produccion|null>(null),

    costoProduccion: new FormControl<number>(0, { nonNullable: true }),
    gastosAdministrativos: new FormControl<string>('', { nonNullable: true }),
    
    cantera: new FormControl<Opcion | null>(null),
    tipo: new FormControl<Opcion | null>(null),
    color: new FormControl<Opcion | null>(null),

    embalajeJava:new FormControl<boolean>(false,{nonNullable:true}),
    embalajeCarton:new FormControl<boolean>(false,{nonNullable:true}),
    embalajeCajaMadera:new FormControl<boolean>(false,{nonNullable:true}),
    embalajeCaballete:new FormControl<boolean>(false,{nonNullable:true}),

    tipoEnvio: new FormControl<TipoEnvio | null>(null),


    //columna derecha
    costoMateriaPrima:new FormControl<number>(0,{nonNullable:true}),
    exnFab: new FormControl('', { nonNullable: true }),
    flete: new FormControl('', { nonNullable: true }),

  });

  constructor(private router: Router,
    private cotizacionesService: CotizacionesService,
    private route: ActivatedRoute,
    private messageService: MessageService
  ) {}

  ngOnInit() {

    //datos del formulario
    this.producciones = [
      { id: '01', descripcion: 'Mosaico' },
      { id: '02', descripcion: 'Baldosa' },
      { id: '03', descripcion: 'Plancha' },
    ];

    this.canteras = [
      { id: '1', descripcion: 'huascar' },
      { id: '2', descripcion: 'albertino' },
      { id: '3', descripcion: 'huaral' }
    ];

    this.tipos = [
      { id: '1', descripcion: 'comercial' },
      { id: '2', descripcion: 'primera' },
      { id: '3', descripcion: 'no aplica' }
    ];

    this.colores=[
      { id: '1', descripcion: 'volcano' },
      { id: '2', descripcion: 'perlato' },
      { id: '3', descripcion: 'laguna' },
      { id: '4', descripcion: 'machu picchu' },
      { id: '5', descripcion: 'wayna picchu' },
      { id: '6', descripcion: 'madeira' }
    ];

    this.embalajes=[
      { id: '1', descripcion: 'java' },
      { id: '2', descripcion: 'carton' },
      { id: '3', descripcion: 'caja de madera' },
      { id: '4', descripcion: 'caballete' }
    ];

    this.tiposEnvio = [
      { id: '1', descripcion: 'Nacional' },
      { id: '2', descripcion: 'Exportacion' }
    ];

    //primer bloque
    this.formGroup.addControl('cantidad', new FormControl<string>('', { nonNullable: true }));
    this.formGroup.addControl('unidadCantidad', new FormControl<string>('mt2', { nonNullable: true }));

    this.formGroup.addControl('ancho', new FormControl<string>('', { nonNullable: true }));
    this.formGroup.addControl('unidadAncho', new FormControl({ value: 'cm', disabled: true }, { nonNullable: true }));

    this.formGroup.addControl('largo', new FormControl<string>('', { nonNullable: true }));
    this.formGroup.addControl('unidadLargo', new FormControl({ value: 'cm', disabled: true }, { nonNullable: true }));

    this.formGroup.addControl('espesor', new FormControl<string>('', { nonNullable: true }));
    this.formGroup.addControl('unidadEspesor', new FormControl({ value: 'cm', disabled: true }, { nonNullable: true }));

    // Recalculando el costo de produccion
    this.formGroup.controls.produccionElegida.valueChanges.subscribe(() => {
      this.actualizarProcesosPorProduccion();
    });
    
    this.formGroup.controls.tipoEnvio.valueChanges.subscribe(() => {
      this.recalcularCostoProduccion();
    });

    // Recalculando el costo de materia prima
    this.formGroup.controls.cantera.valueChanges.subscribe(()=>{
      this.recalcularCostoMateriaPrima()
    });

    this.formGroup.controls.tipo.valueChanges.subscribe(()=>{
      this.recalcularCostoMateriaPrima()
    });

    this.formGroup.controls.color.valueChanges.subscribe(()=>{
      this.recalcularCostoMateriaPrima()
    });

    this.formGroup.controls.embalajeJava.valueChanges.subscribe(()=>{
      this.recalcularCostoMateriaPrima();
    });

    this.formGroup.controls.embalajeCarton.valueChanges.subscribe(()=>{
      this.recalcularCostoMateriaPrima();
    });

    this.formGroup.controls.embalajeCajaMadera.valueChanges.subscribe(()=>{
      this.recalcularCostoMateriaPrima();
    });

    this.formGroup.controls.embalajeCaballete.valueChanges.subscribe(()=>{
      this.recalcularCostoMateriaPrima();
    });

    this.route.queryParams.subscribe(params => {
  const toast = params['toast'];

  if (toast === 'created') {
    this.messageService.add({
      severity: 'success',
      summary: 'Guardado',
      detail: 'Cotización creada'
    });
  }

  if (toast === 'updated') {
    this.messageService.add({
      severity: 'success',
      summary: 'Actualizado',
      detail: 'Cotización actualizada'
    });
  }
});


    const editId=this.route.snapshot.queryParamMap.get('editId');
    
    if (this.editId) {
      const item = this.cotizacionesService.obtenerPorId(this.editId);
      
      if (item) {
        const tipoEnvioObj = this.tiposEnvio.find(x => x.descripcion === item.tipoEnvio) ?? null;
        const produccionObj = this.producciones.find(x => x.descripcion === item.produccion) ?? null;
        const canteraObj = this.canteras.find(x => x.descripcion === item.cantera) ?? null;
        const tipoObj = this.tipos.find(x => x.descripcion === item.tipoBloque) ?? null;
        const colorObj = this.colores.find(x => x.descripcion === item.color) ?? null;
        const emb = (item.embalaje ?? '').toLowerCase();
        
        this.formGroup.patchValue({
          cantidad: item.cantidad,
          ancho: item.ancho,
          largo: item.largo,
          espesor: item.espesor,
          tipoEnvio: tipoEnvioObj,
          produccionElegida: produccionObj,
          cantera: canteraObj,
          tipo: tipoObj,
          color: colorObj,
          costoProduccion: Number(item.costoInicial || 0),
          costoMateriaPrima: Number(item.costoMateriaPrima || 0),
          embalajeJava: emb.includes('java'),
          embalajeCarton: emb.includes('carton'),
          embalajeCajaMadera: emb.includes('caja'),
          embalajeCaballete: emb.includes('caballete'),
        }, { emitEvent: false });
      }
    }

  }

  // Se ejecuta cuando cambia la seleccion del checkbox tree
  onTreeSelectChange(nodes:TreeNode[]):void{
      this.selectedNodes=nodes??[];
      this.recalcularCostoProduccion();
  }

  procesosBaldosa:Proceso[]=[
    { id: '01', nombre: 'Corte', valor: 10 },
    { id: '02', nombre: 'Desdoblado', valor: 15 },
    { id: '03', nombre: 'Calibrado', valor: 15 },
    { id: '04', nombre: 'Estucado', valor: 15 },
    {
      id: 'linea', nombre: 'Línea', valor: 0,
      hijos: [
         { id: '05', nombre: 'Multidisco', valor: 30 },
      { id: '06', nombre: 'Pulido', valor: 35 },
      { id: '07', nombre: 'Borde', valor: 40 },
      { id: '08', nombre: 'Seleccione y Empaque', valor: 45 },
      ]
    }
  ];

  procesosMosaico: Proceso[] = [
    { id: '09', nombre: 'MOSAICOS-RUMI SERVICIO', valor: 10 },
    { id: '14', nombre: 'MOSAICO - RUMI PRODUCCION', valor: 20 },
  ];

  procesosOtros: Proceso[] = [
    { id: 'corte', nombre: 'Corte', valor: 10 },
    { id: 'desdoblado', nombre: 'Desdoblado', valor: 15 },
    { id: 'calibrado', nombre: 'Calibrado', valor: 20 },
    { id: 'estucado', nombre: 'Estucado', valor: 25 },
    {
      id: 'linea', nombre: 'Línea', valor: 0,
      hijos: [
        { id: 'linea11', nombre: 'Línea11', valor: 30 },
        { id: 'linea12', nombre: 'Línea12', valor: 35 },
        { id: 'linea13', nombre: 'Línea13', valor: 40 },
      ]
    }
  ];

  procesosPlancha: Proceso[] = [
  { id: '10', nombre: 'CALIBRADO PLANCHA', valor: 15 },
  { id: '11', nombre: 'ESTUCADO PLANCHA', valor: 20 },
  { id: '12', nombre: 'PUENTE FRESA', valor: 25 },
  { id: '13', nombre: 'Seleccione y Empaque', valor: 25 },
  { id: '15', nombre: 'CORTE-TELAR', valor: 10 },
];




  private getValorProduccion(p:Produccion|null):number{
    if(!p) return 0;

    switch(p.id){
      case '1': return 10;
      case '2': return 15;
      case '3': return 20;
      default: return 0;
    }
  }

  private getValorTipoEnvio(t: TipoEnvio|null):number{
    if(!t) return 0;

    switch(t.id){
      case '1': return 10;
      case '2': return 15;
      default: return 0;
    }
  }

  /*
  private readonly valoresTree: Record<string,number>={
    corte:10,
    desdoblado:15,
    calibrado:20,
    estucado:25,
    linea11:30,
    linea12:35,
    linea13:40
  };
  */

  // Suma de valores columna izquierda
  private sumarValoresProcesos():number{
    let total=0;

    for(const n of (this.selectedNodes??[])){
      const key=String(n.key??'');
      if(this.valoresProcesos[key]!=null){
        total+=this.valoresProcesos[key];
      }
    }

    return total;
  }

  // Calculo total columna izquierda
  private recalcularCostoProduccion():void{
    const produccion=this.formGroup.controls.produccionElegida.value;
    const tipoEnvio=this.formGroup.controls.tipoEnvio.value;

    const valorProduccion=this.getValorProduccion(produccion);
    const valorTree=this.sumarValoresProcesos();
    const valorEnvio=this.getValorTipoEnvio(tipoEnvio);

    const total=valorProduccion+valorTree+valorEnvio;

    this.formGroup.controls.costoProduccion.setValue(total,{emitEvent:false});
  }

  private getValorCantera(o:Opcion|null):number{
    if(!o) return 0;

    switch(o.id){
      case '1':return 2;
      case '2':return 3;
      case '3':return 4;
      default:return 0;
    }
  }

  private getValorTipoBloque(o:Opcion|null):number{
    if(!o) return 0;

    switch(o.id){
      case '1': return 2;
      case '2': return 3;
      case '3': return 4;
      default: return 0;
    }
  }

  private getValorColor(o:Opcion|null):number{
    if(!o) return 0;

    switch(o.id){
      case '1': return 2;
      case '2': return 3;
      case '3': return 4;
      case '4': return 5;
      case '5': return 6;
      case '6': return 7;
      default: return 0;
    }
  }
  
  // valores numericos del checkbox embalaje
  private readonly valoresEmbalaje:Record<EmbalajeKey,number>={
    java:3,
    carton:4,
    cajaMadera: 5,
    caballete: 6
  };

  private sumarValoresEmbalaje():number{
    let total=0;

    if(this.formGroup.controls.embalajeJava.value) total+=this.valoresEmbalaje.java;
    if(this.formGroup.controls.embalajeCarton.value) total+=this.valoresEmbalaje.carton;
    if(this.formGroup.controls.embalajeCajaMadera.value) total+=this.valoresEmbalaje.cajaMadera;
    if(this.formGroup.controls.embalajeCaballete.value) total+=this.valoresEmbalaje.caballete;

    return total;
  }

  private recalcularCostoMateriaPrima():void{
    const cantera=this.formGroup.controls.cantera.value;
    const tipo=this.formGroup.controls.tipo.value;
    const color=this.formGroup.controls.color.value;

    const vCantera=this.getValorCantera(cantera);
    const vTipo=this.getValorTipoBloque(tipo);
    const vColor=this.getValorColor(color);
    const vEmbalaje=this.sumarValoresEmbalaje();

    const total=vCantera+vTipo+vColor+vEmbalaje;

    this.formGroup.controls.costoMateriaPrima.setValue(total,{ emitEvent: false });
  }

  private convertirProcesosATreeNodes(procesos:Proceso[]):TreeNode[]{
    const children:TreeNode[]=[];

    for(const p of procesos){
      children.push(this.procesoANodo(p));
    }

    return[{
      label:'Procesos',
      key:'procesos',
      selectable:false,
      expanded: true,
      children
    }];
  }

  // Muestra los nodos correspondientes a un proceso
  private procesoANodo(p:Proceso):TreeNode{
    const nodo:TreeNode={
      label:p.nombre,
      key:p.id
    };

    if(p.hijos?.length){
      nodo.children=p.hijos.map(h=>this.procesoANodo(h));
      nodo.expanded=true;
    }
    return nodo;
  }

  private valoresProcesos: Record<string, number> = {};

  private cargarValoresProcesos(procesos:Proceso[]):void{
    this.valoresProcesos={};
    const recorrer=(arr:Proceso[])=>{
      for(const p of arr){
        this.valoresProcesos[p.id]=p.valor;
        if(p.hijos?.length) recorrer(p.hijos);
      }
    };
    recorrer(procesos);
  }

  private actualizarProcesosPorProduccion():void{
    const prod=this.formGroup.controls.produccionElegida.value;
    const desc=(prod?.descripcion??'').toLocaleLowerCase();

    let procesos:Proceso[];

    if (desc === 'mosaico') {
    procesos = this.procesosMosaico;
  } else if (desc === 'baldosa') {
    procesos = this.procesosBaldosa;
  } else if (desc === 'plancha') {
    procesos = this.procesosPlancha; 
  } else {
    procesos = [];
  }

     this.treeNodes = this.convertirProcesosATreeNodes(procesos);
     this.cargarValoresProcesos(procesos);
      this.selectedNodes = [];
      this.recalcularCostoProduccion();
  }

  botonGuardar():void{
    if(this.formGroup.invalid){
      this.formGroup.markAllAsTouched();

      this.messageService.add({
        severity:'error',
        summary:'Error',
        detail: 'Completa todos los campos'
      });
      return;
    }

    const raw =this.formGroup.getRawValue();
    const id = this.editId ?? ((crypto as any)?.randomUUID?.() ?? Date.now().toString());

    const item:CotizacionItem={
      id,
      cantidad: raw.cantidad,
      ancho: raw.ancho,
      largo: raw.largo,
      espesor: raw.espesor,
      tipoEnvio: raw.tipoEnvio?.descripcion ?? '',
      produccion: raw.produccionElegida?.descripcion ?? '',
      costoInicial: String(raw.costoProduccion),
      cantera: raw.cantera?.descripcion ?? '',
      tipoBloque: raw.tipo?.descripcion ?? '',
      color: raw.color?.descripcion ?? '',
      costoMateriaPrima: String(raw.costoMateriaPrima), 
      embalaje: this.embalajeTexto(raw),
    };
    
    if (this.editId) {
      this.cotizacionesService.actualizar(this.editId, item);
    } else {
      this.cotizacionesService.agregar(item);
    }

    this.router.navigate(['/Home/cotizador/lista'], {
      queryParams: { toast: this.editId ? 'updated' : 'created' }
    });
  }

  private embalajeTexto(raw: any): string {
    const arr: string[] = [];
    if (raw.embalajeJava) arr.push('java');
    if (raw.embalajeCarton) arr.push('carton');
    if (raw.embalajeCajaMadera) arr.push('caja de madera');
    if (raw.embalajeCaballete) arr.push('caballete');
    return arr.join(', ');
  }


}



