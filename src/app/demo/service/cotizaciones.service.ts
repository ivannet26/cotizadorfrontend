import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CotizacionItem } from '../model/CotizacionItem';

@Injectable({providedIn:'root'})
export class CotizacionesService{
    private readonly storageKey='cotizaciones';
    private readonly subject=new BehaviorSubject<CotizacionItem[]>(this.load());

    cotizaciones$=this.subject.asObservable();

    listar():CotizacionItem[]{
        return this.subject.value;
    }

    agregar(item:CotizacionItem):CotizacionItem{
        const updated=[item,...this.subject.value];
        this.subject.next(updated);
        localStorage.setItem(this.storageKey,JSON.stringify(updated));
        return item;
    }

    private load():CotizacionItem[]{
        try{
            const raw=localStorage.getItem(this.storageKey);
            return raw?JSON.parse(raw):[];
        }catch{
            return[];
        }
    }

    obtenerPorId(id:string):CotizacionItem|undefined{
        return this.subject.value.find(x=>x.id===id);
    }

    actualizar(id:string,changes:Partial<CotizacionItem>):void{
        const updated=this.subject.value.map(x=>x.id=== id ? { ...x, ...changes } : x);
        this.subject.next(updated);
        localStorage.setItem(this.storageKey,JSON.stringify(updated));
    }

}