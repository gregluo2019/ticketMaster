import { Component, forwardRef, OnInit } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { AppService } from 'src/app/core/services/app.service';
import { Classification } from '../events.model';

@Component({
  selector: 'app-classification-select',
  templateUrl: './classification-select.component.html',
  styleUrls: ['./classification-select.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ClassificationSelectComponent),
    multi: true
  }],
})
export class ClassificationSelectComponent implements OnInit {
  private onChange = (_: any) => { };
  private onTouched = () => { };;

  writeValue(obj: string): void {
    if (!obj) { return }

    this.myInput.setValue(obj)
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  classifications: Classification[] = [];

  myInput = new FormControl();
  mySelection = new FormControl();
  filteredOptions: Observable<Classification[]>;

  constructor(private appService: AppService) { }

  ngOnInit() {
    if (this.appService.classifications.length === 0) {
      this.appService.getClassifications()
    } else {
      this.initClassifications()
    }
    this.appService.classificationsSubject.subscribe(() => {
      this.initClassifications()
    })
  }

  private _filter(name: string): Classification[] {
    if (name) {
      const filterValue = name.toLowerCase();
      return this.classifications.filter(option => option.name.toLowerCase().includes(filterValue));
    } else {
      return this.classifications
    }
  }

  onSelect(event) {
    let result = event.option.value
    this.onChange(result);
    this.onTouched();
  }

  displayFn(classification: Classification): string {
    return classification && classification.name ? classification.name : '';
  }

  initClassifications() {
    this.classifications = [new Classification('', ''), ...this.appService.classifications]

    this.filteredOptions = this.myInput.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.name),
        map(name => this._filter(name))
      );
  }
}
