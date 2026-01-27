import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { CotizacionItem } from '../../model/CotizacionItem';
import { ButtonModule } from 'primeng/button';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { Router } from '@angular/router';
import { CotizacionesService } from '../../service/cotizaciones.service';
import { DropdownModule } from 'primeng/dropdown';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ActivatedRoute } from '@angular/router';


//PRUEBA
import { ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { CheckboxModule } from 'primeng/checkbox';
import { FilterService } from 'primeng/api';
import { OverlayPanel } from 'primeng/overlaypanel';

@Component({
  selector: 'app-lista-cotizaciones',
  standalone: true,
  imports: [
    CardModule,
    CommonModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    FormsModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
    DropdownModule,
    ToastModule,

    //PRUEBA
    OverlayPanelModule, CheckboxModule

  ],
  templateUrl: './lista-cotizaciones.component.html',
  styleUrl: './lista-cotizaciones.component.css',
  providers: [ConfirmationService,MessageService,FilterService]
})


export class ListaCotizacionesComponent implements OnInit{

  //PRUEBA
  //estado y referencias para el filtro tipo Excel
  @ViewChild('dt') dt!: Table;
  @ViewChild('filterPanel') filterPanel!: OverlayPanel; 
  activeField: keyof CotizacionItem | null = null;
  options: string[] = [];
  filteredOptions: string[] = [];
  filterSearch = '';
  tempSelection: string[] = [];
  appliedSelection: Record<string, string[]> = {}; 



  items:CotizacionItem[]=[];
  isEditingAnyRow: boolean = false;
  isNew:boolean=false;
  isEditing:boolean=false;
  rowsPerPage: number = 10;
  rowsPerPageOptions = [10, 20, 40];

  //null=nueva fila | number=editar fila existente
  private editingIndex: number | null = null;

  cotizacionForm: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private confirmationService:ConfirmationService,
    private router:Router,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private cotizacionesService:CotizacionesService,
  
  private filterService: FilterService) {
    this.cotizacionForm = this.fb.group({
      cantidad: ['', Validators.required],
      ancho: ['', Validators.required],
      largo: ['', Validators.required],
      espesor: ['', Validators.required],
      tipoEnvio: ['', Validators.required],
      produccion: ['', Validators.required],
      costoInicial: [''],
      cantera: ['', Validators.required],
      tipoBloque: ['', Validators.required],
      color: ['', Validators.required],
      costoMateriaPrima: [''],
      embalaje: ['']
    });
  }

  ngOnInit(): void {
    this.cotizacionesService.cotizaciones$.subscribe(data=>{
      this.items=data;

    });



    this.route.queryParams.subscribe(params => {
    const toast = params['toast'];

    setTimeout(() => {
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
    }, 100); 
  });
  }

  //crear cotizacion
  showAddRow() {
    this.isEditing = true;
    this.isNew = true;
    this.editingIndex = null;
    this.cotizacionForm.reset();
  }

  //guardar cotizacion
  onSave() {
    if (this.cotizacionForm.invalid) {
      this.cotizacionForm.markAllAsTouched();
      return;
    }

    const formValue = this.cotizacionForm.value;

    if(this.editingIndex===null){
      const newItem: CotizacionItem = {
        id: String(Date.now()),
        ...formValue
      };

      this.items=[newItem,...this.items];
    }else{
      const updated:CotizacionItem={
        ...this.items[this.editingIndex],
        ...formValue
      };

      this.items[this.editingIndex]=updated;
      this.items=[...this.items];
    }

    this.finishEdit();
  }

  onCancel() {
    this.finishEdit();
  }

  private finishEdit() {
    this.isEditing = false;
    this.isNew = false;
    this.editingIndex = null;
    this.cotizacionForm.reset();
  }

  onEditRow(row: CotizacionItem, index: number) {
    this.isEditing = true;
    this.isNew=false;
    this.editingIndex=index;

    this.cotizacionForm.patchValue({
      cantidad: row.cantidad,
      ancho: row.ancho,
      largo: row.largo,
      espesor: row.espesor,
      tipoEnvio: row.tipoEnvio,
      produccion: row.produccion,
      costoInicial: row.costoInicial,
      cantera: row.cantera,
      tipoBloque: row.tipoBloque,
     // color: row.color,
      costoMateriaPrima: row.costoMateriaPrima,
      embalaje: row.embalaje
    });
  }
  
  onDeleteRow(row: CotizacionItem, index: number) {
    this.confirmationService.confirm({
      message: `¿Eliminar esta cotización?`,
      header: 'Confirmar Eliminación',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.items.splice(index, 1);
        this.items = [...this.items]; 

        this.messageService.add({
          severity: 'success',
          summary: 'Eliminado',
          detail: 'Cotización eliminada'
      });
    }
  });
  }

  goToFormCotizador(){
    this.router.navigate(['/Home/cotizador']);
  }

  editarCotizacion(row:CotizacionItem){
    this.router.navigate(['/Home/cotizador'],{
      queryParams:{editId:row.id}
    });
  }


  //PRUEBA
  private numericFields = new Set<keyof CotizacionItem>([
    'item',
    'cantidad',
    'costoInicial',
    'costoMateriaPrima'
  ]);


  //abre el overlay del filtro para la columna seleccionada
  openFilter(event: Event, field: keyof CotizacionItem) {
    this.activeField = field;
    this.buildTextOptions(field);
    this.filterPanel.toggle(event);
  }
  
  //carga la selección aplicada para la columna
  private buildTextOptions(field: keyof CotizacionItem) {
    const raw = (this.items || [])
    .map(x => (x as any)[field])
    .filter(v => v !== null && v !== undefined)
    .map(v => String(v).trim());
    const uniq = Array.from(new Set(raw));
    
    // orden numerico
    uniq.sort((a, b) => a.localeCompare(b, undefined, {
       numeric: true, sensitivity: 'base'
       }));
       
       this.options = uniq;
       this.filteredOptions = [...uniq];
       this.filterSearch = '';
       this.tempSelection = [...(this.appliedSelection[field as string] ?? [])];
      }
      
      //filtra las opciones del checklist
      filterOptions() {
        const q = (this.filterSearch || '').toLowerCase();
        this.filteredOptions = this.options.filter(v => v.toLowerCase().includes(q));
      }
      
      //selecciona todas las opciones del checklist
      selectAllVisible() {
        const set = new Set(this.tempSelection);
        this.filteredOptions.forEach(v => set.add(v));
        this.tempSelection = Array.from(set);
      }
      
      //limpia la selección del filtro
      clearAll() {
        this.tempSelection = [];
      }
      
      // aplica el filtro en la columna
      apply(panel: any) {
        if (!this.activeField) return;
        this.appliedSelection[this.activeField as string] = [...this.tempSelection];
        const field = this.activeField;
        const valueToFilter = this.tempSelection.length ? (this.numericFields.has(field)
        ? this.tempSelection.map(v => Number(v))
        : this.tempSelection) : null;
        this.dt.filter(valueToFilter, field as string, 'in');
        panel.hide();
      }

      
      cancel(panel: any) {
        panel.hide();
      }


}
