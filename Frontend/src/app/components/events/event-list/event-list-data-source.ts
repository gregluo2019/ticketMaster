import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { Observable, of } from "rxjs";
import { Event } from "../events.model";

export class EventListDataSource implements DataSource<Event> {
    constructor(private data: Event[]) {
    }

    connect(collectionViewer: CollectionViewer): Observable<Event[]> {
        return of(this.data);
    }

    disconnect(collectionViewer: CollectionViewer): void {
    }
}