import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Subject } from 'rxjs';
import { AppService } from 'src/app/core/services/app.service';
import { Classification } from '../events.model';
import { ClassificationSelectComponent } from './classification-select.component';

describe('ClassificationSelectComponent', () => {
  let component: ClassificationSelectComponent;
  let fixture: ComponentFixture<ClassificationSelectComponent>;

  let mockAppService = jasmine.createSpyObj(['getClassifications']);
  let mockClassification = new Classification("c111", "nameOfC111")
  mockAppService.classifications = [mockClassification]
  mockAppService.classificationsSubject = new Subject();
  mockAppService.getClassifications.and.returnValue();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, MatAutocompleteModule],
      declarations: [ClassificationSelectComponent],
      providers: [{ provide: AppService, useValue: mockAppService }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassificationSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return data from service function', () => {
    expect(component.classifications).toHaveSize(2);
  })
});
