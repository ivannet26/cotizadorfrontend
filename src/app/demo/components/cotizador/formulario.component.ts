import { Component, OnInit, NgZone } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TreeModule } from 'primeng/tree';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';
import { CheckboxModule } from 'primeng/checkbox';


interface Produccion {
  id: string;
  descripcion: string;
}
interface Opcion {
  id: string;
  descripcion: string;
}
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
    CheckboxModule
  ],
  templateUrl: './formulario.component.html',
  styleUrl: './formulario.component.css'
})


export class FormularioComponent implements OnInit {

  // Dropdown Produccion
  producciones: Produccion[] = [];
  
  // Dropdowns Materia Prima
  canteras: Opcion[] = [];
  tipos: Opcion[] = [];
  calidades: Opcion[] = [];
  colores:Opcion[]=[];
  embalajes:Opcion[]=[]

  //Checkbox Tree
  treeNodes:TreeNode[]=[
    {
      label:'Procesos',
      key: 'procesos',
      children:[
      { label: 'Corte', key: 'corte' },
      { label: 'Desdoblado', key: 'desdoblado' },
      { label: 'Calibrado', key: 'calibrado' },
      { label: 'Estucado', key: 'estucado' },

      {
        label:'Línea',
        key:'linea',
        children:[
          { label: 'Línea11', key: 'linea11' },
          { label: 'Línea12', key: 'linea12' },
          { label: 'Línea13', key: 'linea13' },
        ]
      }
      ]
    }
  ];

  // Nodos seleccionados
  selectedNodes:TreeNode[]=[]; 

  formGroup = new FormGroup({

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


    //columna derecha
    costoMateriaPrima:new FormControl<number>(0,{nonNullable:true})
  });

  ngOnInit() {

    //datos del formulario
    this.producciones = [
      { id: '1', descripcion: 'Mosaico' },
      { id: '2', descripcion: 'Baldosa' },
      { id: '3', descripcion: 'Filaña' },
      { id: '4', descripcion: 'Plancha' },
      { id: '5', descripcion: 'Escalla' },
      { id: '6', descripcion: 'Ovalin' },
      { id: '7', descripcion: 'Plancha' }
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

    // Recalculando el costo al cambiar la opcion en dropdownlist Produccion
    this.formGroup.controls.produccionElegida.valueChanges.subscribe(()=>{
      this.recalcularCostoProduccion();
    });

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

  }

  // Se ejecuta cuando cambia la seleccion del checkbox tree
  onTreeSelectChange(nodes:TreeNode[]):void{
      this.selectedNodes=nodes??[];
      this.recalcularCostoProduccion();
  }

  private getValorProduccion(p:Produccion|null):number{
    if(!p) return 0;

    switch(p.id){
      case '1': return 10;
      case '2': return 15;
      case '3': return 20;
      case '4': return 25;
      case '5': return 30;
      case '6': return 35;
      case '7': return 40;
      default: return 0;
    }
  }

  private readonly valoresTree: Record<string,number>={
    corte:10,
    desdoblado:15,
    calibrado:20,
    estucado:25,
    linea11:30,
    linea12:35,
    linea13:40
  };

  // Suma de valores columna izquierda
  private sumarValoresProcesos():number{
    let total=0;

    for(const n of (this.selectedNodes??[])){
      const key=String(n.key??'');
      if(this.valoresTree[key]!=null){
        total+=this.valoresTree[key];
      }
    }

    return total;
  }

  // Calculo total columna izquierda
  private recalcularCostoProduccion():void{
    const produccion=this.formGroup.controls.produccionElegida.value;
    const valorProduccion=this.getValorProduccion(produccion);
    const valorTree=this.sumarValoresProcesos();
    const total=valorProduccion+valorTree;

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
}
