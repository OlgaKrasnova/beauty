import { Pipe, PipeTransform } from '@angular/core';
import { Request } from '../models/request.model';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';

@Pipe({
    name: 'sort'
})

export class SortPipe implements PipeTransform {

    transform(requests: Request[], search: string) {
        if(!isNullOrUndefined(requests) && (search || '').trim() !== "") {
            if (search == "1") {
                let search_requests = requests.filter(
                    request => request.status === 'принят в работу'
                );
                return search_requests;
            } else if (search == "2") {
                let search_requests = requests.filter(
                    request => request.status === 'звонок отклонен'
                );
                return search_requests;
            } else if (search == "3") {
                let search_requests = requests.filter(
                    request => request.status === 'звонок совершен'
                );
                return search_requests;
            } else {
                return requests;
            }
        }
        return requests;
    }
}