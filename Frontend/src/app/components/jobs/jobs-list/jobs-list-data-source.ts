import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, of } from "rxjs";
import { Job } from "../jobs.model";

export class JobListDataSource implements DataSource<Job> {
    constructor(private data: Job[]) {
    }

    connect(collectionViewer: CollectionViewer): Observable<Job[]> {
        return of(this.data);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}