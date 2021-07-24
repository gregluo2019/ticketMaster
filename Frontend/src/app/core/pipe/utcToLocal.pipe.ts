import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { TIME_FORMAT } from "src/app/shared/ConstantItems";

@Pipe({ name: 'UtcToLocal' })
export class UtctToLocalPipe implements PipeTransform {
    /**
     * Transform
     *
     * @param {string} value
     * @param {any[]} args
     * @returns {string}
     */
    transform(value: Date | string, args: any[] = []): string {
        if (!value) {
            return ''
        }
        if (value === "0001-01-01T00:00:00") {
            return ''
        }
        return moment.utc(value).local().format(TIME_FORMAT);
    }
}
