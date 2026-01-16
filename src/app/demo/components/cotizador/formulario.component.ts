import { Component, OnInit  } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { DropdownModule } from 'primeng/dropdown';
import { TreeModule } from 'primeng/tree';
import { InputTextModule } from 'primeng/inputtext';
import { FieldsetModule } from 'primeng/fieldset';
import { PanelModule } from 'primeng/panel';

interface Produccion {
    name: string;
    code: string;
}
interface Opcion {
  name: string;
  code: string;
}

@Component({
  selector: 'app-formulario',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DropdownModule,
    TreeModule,
    InputTextModule,
    FieldsetModule,
    PanelModule
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

  selectedNodes:TreeNode[]=[]; // seleccion del tree

  formGroup = new FormGroup({
    produccionElegida: new FormControl<Produccion|null>(null),
    costoProduccion: new FormControl<string>('', { nonNullable: true }),
    gastosAdministrativos: new FormControl<string>('', { nonNullable: true }),
    cantera: new FormControl<Opcion | null>(null),
    tipo: new FormControl<Opcion | null>(null),
    calidad: new FormControl<Opcion | null>(null)
  });

  ngOnInit() {

    //datos de prueba
    this.producciones = [
      { name: 'New York', code: 'NY' },
      { name: 'Rome', code: 'RM' },
      { name: 'London', code: 'LDN' },
      { name: 'Istanbul', code: 'IST' },
      { name: 'Paris', code: 'PRS' }
    ];

    this.canteras = [
      { name: 'Cantera A', code: 'CA' },
      { name: 'Cantera B', code: 'CB' },
      { name: 'Albertino', code: 'AL' }
    ];

    this.tipos = [
      { name: 'Tipo 1', code: 'T1' },
      { name: 'Tipo 3', code: 'T3' },
      { name: 'Primera', code: 'primera' }
    ];

    this.calidades = [
      { name: 'Rojo', code: 'rojo' },
      { name: 'Amarillo', code: 'marillo' },
      { name: 'Azul', code: 'azul' }
    ];
  }
}
