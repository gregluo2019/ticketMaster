export class Event {
    constructor(
        public id: string,
        public name: string,
        public info: string,
        public startTime: string,

        public images: string[],
        public ticketLimit: string,
        public classification: string,
        public promoter: string,
        public salesTimeRange: string,

        public attraction: Attraction = null,
        public venue: Venue = null,
    ) { }
}

export class Classification {
    constructor(
        public id: string,
        public name: string,
    ) { }
}
export class Attraction {
    constructor(
        public id: string,
        public name: string,
        public images: string[] = [],
    ) { }
}
export class Venue {
    constructor(
        public id: string,
        public name: string,
        public address: string,
        public generalInfo: string = '',
        public parkingDetail: string = '',
        public images: string[] = [],
    ) { }
}
export class PaginationDataOfEvent {
    constructor(
        public sort: string = '',
        public sortDirection: string = 'desc',
        public pageIndex: number = 0,
        public pageSize: number = 20,
        public keyword: string = '',
        public startDateTime: string = '',
        public endDateTime: string = '',
        public venueId: string = '',
        public classificationId: string = ''
    ) { }
}
