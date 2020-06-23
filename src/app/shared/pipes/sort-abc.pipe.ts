import { Pipe, PipeTransform } from '@angular/core';
import { Request } from '../models/request.model';
import { isNullOrUndefined } from 'util';

@Pipe({
    name: 'sortAbc'
})

export class SortAbcPipe implements PipeTransform {

    transform(requests: Request[], sort: string) {
        if(!isNullOrUndefined(requests) && (sort || '').trim() !== "") {
            if (sort == "1") {
                let sort_requests = requests.sort((a: any, b: any) => {
                    if (a.fio < b.fio) {
                        return -1;
                      } else if (a.fio > b.fio) {
                        return 1;
                      } else {
                        return 0;
                      }
                    }
                );
                return sort_requests;
            } else if (sort == "2") {
                let sort_requests = requests.sort((a: any, b: any) => {
                    if (a.fio > b.fio) {
                        return -1;
                      } else if (a.fio < b.fio) {
                        return 1;
                      } else {
                        return 0;
                      }
                    }
                );
                return sort_requests;
            } else {
                return requests;
            }
        }
        return requests;
    }
}
