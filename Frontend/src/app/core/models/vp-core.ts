import * as moment from 'moment';

//#region Base entity class

export class VpBase {
    constructor(data: any = {}) {
        Object.assign(this, data);
    }

    // public initDateAsMoment(val: any, utc: boolean = false): moment.Moment {
    //     // note the logic here is back to front because the date times are stored in local time on the server
    //     if (val) {
    //         if (!moment.isMoment(val)) {
    //             if (utc) {
    //                 val = moment.utc(val);
    //             }
    //             else {
    //                 val = moment(val);
    //             }
    //         }
    //     }
    //     return val;
    // }
}

export class VpBaseModel extends VpBase {
    constructor(data: any = {}) {
        super(data);
    }

    public initDateAsMoment(val: any, utc: boolean = false): moment.Moment {
        // note the logic here is back to front because the date times are stored in local time on the server
        if (val) {
            if (!moment.isMoment(val)) {
                if (utc) {
                    val = moment.utc(val);
                }
                else {
                    val = moment(val);
                }
            }
        }
        return val;
    }
}

export class VpBaseFilter extends VpBaseModel {
    constructor(data: any = {}) {
        super(data);
    }
}

export class VpPagedFilter extends VpBaseFilter {
    constructor(data: any = {}) {
        super(data);
        if (!this.pageSize) {
            this.pageSize = 0;
        }
        if (!this.page) {
            this.page = 0;
        }
        if (!this.hasMore) {
            this.hasMore = true;
        }
    }

    public page: number;
    public pageSize: number;
    public hasMore: boolean;
}

export interface IVpBaseProperties {
    id: string;
    name: string;
    description: string;
    type: string;
    sortOrder: number;
    createdAt: Date | moment.Moment;
    modifiedAt: Date | moment.Moment;
}

export class VpBaseProperties extends VpBase implements IVpBaseProperties {
    constructor(data: any = {}) {
        super(data);
    }
    public id: string;
    public name: string;
    public description: string;
    public type: string;
    public sortOrder: number;
    public createdAt: Date | moment.Moment;
    public modifiedAt: Date | moment.Moment;
}


//#endregion

//#region VpCachedItem for use in local storage

export class VpCachedItem<T> {

    constructor(data: T) {
        this.timestamp = Date.now();
        this.data = data;
    }

    public timestamp: number;
    public data: T;
}


//#endregion


//#region VpRequestStatus

export class VpRequestStatus {

    public static INITIAL: string = 'INITIAL';
    public static LOADING: string = 'LOADING';
    public static LOADED: string = 'LOADED';
    public static ERROR: string = 'ERROR';

    constructor(data: any = null) {
        if (data) {
            Object.assign(this, data);
        }
        else {
            this.init();
        }

    }
    public status: string;
    public reason: string;

    public merge(list: Array<VpRequestStatus>): VpRequestStatus {

        let countLoaded = 0;
        let countError = 0;
        let reasonError = '';

        for (const o of list) {
            switch (o.status) {
                case VpRequestStatus.INITIAL:
                    break;

                case VpRequestStatus.LOADING:
                    break;

                case VpRequestStatus.LOADED:
                    countLoaded++;
                    break;

                case VpRequestStatus.ERROR:
                    countError++;
                    if (reasonError.length > 0) {
                        reasonError += ' and ';
                    }
                    reasonError += o.reason;
                    break;
            }
        }
        if (countError > 0) {
            this.status = VpRequestStatus.ERROR;
            this.reason = reasonError;
        }
        else if (countLoaded > 0 && countLoaded === list.length) {
            this.status = VpRequestStatus.LOADED;
            this.reason = '';
        }
        else if (countLoaded > 0) {
            this.status = VpRequestStatus.LOADING;
            this.reason = '';

        }
        else {
            this.status = VpRequestStatus.INITIAL;
            this.reason = '';
        }
        return this;
    }

    public init(): void {
        this.status = VpRequestStatus.INITIAL;
        this.reason = '';
    }

    public isInitial(): boolean {
        return this.status === VpRequestStatus.INITIAL;
    }

    public loading(): void {
        this.status = VpRequestStatus.LOADING;
        this.reason = '';
    }

    public isLoading(): boolean {
        return this.status === VpRequestStatus.LOADING;
    }

    public loaded(): void {
        this.status = VpRequestStatus.LOADED;
        this.reason = '';
    }

    public isLoaded(): boolean {
        return this.status === VpRequestStatus.LOADED;
    }


    public error(reason: string): void {
        this.status = VpRequestStatus.ERROR;
        this.reason = reason;
    }

    public isError(): boolean {
        return this.status === VpRequestStatus.ERROR;
    }
}

//#endregion


//#region VpEvent for use in EventBus


export class VpEvent extends VpBase {

    constructor(data: any = {}) {
        super(data);
    }

    public static REFRESH: string = 'REFRESH';
    public static SHOW_SETTINGS: string = 'SHOW-SETTINGS';
    public static SAVE_AS_DEFAULT_SETTINGS: string = 'SAVE-AS-DEFAULT-SETTINGS';
    public static SHOW_INTERPRETATION_HELP: string = 'SHOW-INTERPRETATION-HELP';
    public static EXPORT_WIDGET_DATA: string = 'EXPORT-WIDGET-DATA';

    public event: string;
    public dataType: string;
    public data: Object;
}


//#endregion

export class VpWriteActionRequestBase {
    constructor(data: any = {}) {
        Object.assign(this, data);
    }
    public requestedBy: string;
}

export class VpAction {
    public static ACTION_NONE: string = 'NONE';
    public static ACTION_CANCEL: string = 'CANCEL';
    public static ACTION_CLOSE: string = 'CLOSE';

    public static ACTION_IMPORT: string = 'IMPORT';
    public static ACTION_EXPORT: string = 'EXPORT';
    public static ACTION_CLONE: string = 'CLONE';
    public static ACTION_FIND_REPLACE: string = 'FIND-REPLACE';
    public static ACTION_DIRTY: string = 'DIRTY';
    public static ACTION_CLEAN: string = 'CLEAN';
    public static ACTION_ADD: string = 'ADD';
    public static ACTION_EDIT: string = 'EDIT';
    public static ACTION_DELETE: string = 'DELETE';
    public static ACTION_SELECT: string = 'SELECT';
    public static ACTION_REFRESH: string = 'REFRESH';


    public static ACTION_SAVED_OPEN: string = 'SAVED-OPEN';
    public static ACTION_SAVED_SHARE: string = 'SAVED-SHARE';
    public static ACTION_SHARED_LINK: string = 'SHARED-LINK';
}

export class VpResponse extends VpBase {

    constructor(data: any = {}) {
        super(data);
    }

    public static NOT_FOUND: string = 'NOT FOUND';

    public action: string;
    public success: boolean;
    public message: string;
    public data: Object;
    public dataType: string;
    public successful(msg: string, data: Object = null, dataType: string = ''): VpResponse {
        this.success = true;
        this.message = msg;
        this.data = data;
        this.dataType = dataType;
        return this;
    }
    public failed(msg: string, data: Object = null, dataType: string = ''): VpResponse {
        this.success = false;
        this.message = msg;
        this.data = data;
        this.dataType = dataType;
        return this;
    }
    public notFound(msg: string): VpResponse {
        this.success = false;
        this.message = msg;
        this.data = VpResponse.NOT_FOUND;
        return this;
    }
    public isNotFound(): boolean {
        return (this.success === false) && (this.data !== null) && (typeof this.data === 'string') && (<string>this.data === VpResponse.NOT_FOUND);
    }
}

export class VpWriteActionRequestPermanentDeleteRequest extends VpWriteActionRequestBase {
    public idToDelete: string;
    public confirmValue: string;
    public confirmToken: string;
}
export class VpWriteActionRequestPermanentDeleteResponse extends VpResponse {

}

export class VpValidation {
    constructor(data: any = {}) {
        Object.assign(this, data);
    }

    public hasInfo: boolean = false;
    public hasWarning: boolean = false;
    public valid: boolean = true;
    public issues: VpValidationIssueList = new VpValidationIssueList();

    public issuesToString(): string {

        let s = '';
        for (const issue of this.issues) {
            s += `${issue.message} `;
        }
        return s;
    }


    public reset(): void {
        this.hasInfo = false;
        this.hasWarning = false;
        this.valid = true;
        this.issues.length = 0;
    }

    public merge(o: VpValidation): void {
        this.hasInfo = this.hasInfo && o.hasInfo;
        this.hasWarning = this.hasWarning && o.hasWarning;
        this.valid = this.valid && o.valid;
        this.issues.push(...o.issues);
    }

    public addIssue(message: string, hint: string = ''): void {
        this.addError(message, hint);
    }

    public addError(message: string, hint: string = ''): void {
        this.issues.push(new VpValidationIssue({
            state: VpValidationIssue.ERROR,
            message: message,
            hint: hint
        }));
        // only error sets the valid state to false.
        this.valid = false;
    }

    public addWarning(message: string, hint: string = ''): void {
        this.issues.push(new VpValidationIssue({
            state: VpValidationIssue.WARNING,
            message: message,
            hint: hint
        }));
        this.hasWarning = true;
    }

    public addInfo(message: string, hint: string = ''): void {
        this.issues.push(new VpValidationIssue({
            state: VpValidationIssue.INFO,
            message: message,
            hint: hint
        }));
        this.hasInfo = true;
    }
}

export class VpValidationIssue {

    constructor(data: any = {}) {
        Object.assign(this, data);
    }
    public static INFO: string = 'INFO';
    public static WARNING: string = 'WARNING';
    public static ERROR: string = 'ERROR';
    public state: string = VpValidationIssue.ERROR;
    public message: string;
    public hint: string;
}

export class VpValidationIssueList extends Array<VpValidationIssue>
{
    constructor() {
        super();
    }
}

//#region Export classes

// export class ExportItem extends VpBaseModel {

//   constructor(data: any = {}) {
//       super(data);
//   }

//   public text: string;
// }

// export class ExportItemList extends Array<ExportItem> {
//   constructor() {
//       super();
//   }
// }


// export class ExportCell extends String {
//   constructor(val: string) {
//     super(val);
//   }
// }

// export class ExportRow extends Array<ExportCell> {
// }

export class ExportSheet extends Array<Array<any>> {
}


//#endregion
