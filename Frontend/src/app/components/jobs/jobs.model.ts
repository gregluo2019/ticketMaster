import * as moment from 'moment';
import { User } from "src/app/core/models/auth/register.model";

export class Job {
    constructor(
        public id: number,
        public jobNumber: string,
        public description: string = '',

        public cuttingStart: Date = null,
        public cuttingEnd: Date = null,

        public sandingStart: Date = null,
        public sandingEnd: Date = null,

        public baseCoatingStart: Date = null,
        public baseCoatingEnd: Date = null,

        public topCoatingStart: Date = null,
        public topCoatingEnd: Date = null,

        public packingStart: Date = null,
        public packingEnd: Date = null,

        public checkIn: Date = null,
        public checkOut: Date = null,
    ) { }
}

export class JobUserAction {
    constructor(
        public jobId: number = null,
        public jobNumber: string = null,

        public userId: number = null,
        public userName: number = null,

        public action: string = null,

        public start: moment.Moment = null,
        public end: moment.Moment = null,

        public duration: string = '',
        public rate: number = null,
    ) { }
}
export class PaginationData {
    constructor(
        public sort: string = '',
        public sortDirection: string = 'desc',
        public pageIndex: number = 0,
        public pageSize: number = 20,
        public filter: string = '',
    ) { }
}

export class Panel {
    constructor(
        public id: number,
        public panelId: string,

        public qty: number = 0,
        public length: number = 0,
        public width: number = 0,
        public depth: number = 0,

        public area: number = 0,
        public totalArea: number = 0,

        public color: string = '',
        public colorType: string = '',

        public packingTime: string = null,
        public packingStaff: User = null,
        public userName: string = null,

        public jobId: number = null,
        // public job: Job = null,

        public description: string = '',
    ) { }
}

export class PrintData {
    constructor(
        public qrData: string = '',
        public textTop1: string = '',
        public textTop2: string = '',
        public textBottom1: string = '',
        public textBottom2: string = '',
    ) { }
}