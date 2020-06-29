import { Pipe, PipeTransform } from '@angular/core';
import { Master } from '../models/master.model';
import { isNullOrUndefined } from 'util';

@Pipe({
    name: 'sortAbcMasters'
})

export class SortAbcMastersPipe implements PipeTransform {

    transform(masters: Master[], sort: string) {
        if(!isNullOrUndefined(masters) && (sort || '').trim() !== "") {
            if (sort === "1") {
                let sort_masters = masters.sort((a: any, b: any) => {
                    if (a.fio < b.fio) {
                        return -1;
                      } else if (a.fio > b.fio) {
                        return 1;
                      } else {
                        return 0;
                      }
                    }
                );
                return sort_masters;
            } else if (sort === "2") {
                let sort_masters = masters.sort((a: any, b: any) => {
                    if (a.fio > b.fio) {
                        return -1;
                      } else if (a.fio < b.fio) {
                        return 1;
                      } else {
                        return 0;
                      }
                    }
                );
                return sort_masters;
            } else {
                return masters;
            }
        }
        return masters;
    }
}
