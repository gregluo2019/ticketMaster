import { Component, ElementRef, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatDialog } from "@angular/material/dialog";
import { MatSort } from "@angular/material/sort";

import { ConfirmDialogComponent } from "src/app/shared/confirm-dialog/confirm.component";
import { BaseComponent } from "../../base.component";
import { Panel } from '../jobs.model';
import { AppService } from '../../../core/services/app.service';
import { MatTableDataSource } from "@angular/material/table";
import * as moment from 'moment';
export class ExportSheet extends Array<Array<any>> { }
import { ExportService } from '../../../core/services/export.service';

@Component({
  selector: "app-panels-list",
  templateUrl: "./panels-list.component.html",
  styleUrls: ["./panels-list.component.scss"],
})
export class PanelsListComponent extends BaseComponent {
  panels: Panel[] = [];
  displayedColumns = [];
  dataSource: MatTableDataSource<Panel>;

  constructor(public dialog: MatDialog, public appService: AppService) {
    super();
    //  this.spinner.show();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit() {
    if (this.appService.panels.length === 0) {
      this.appService.getPanels()
    } else {
      this.initData()
    }
    this.appService.panelsSubject.subscribe(() => {
      this.initData()
    })

    this.displayedColumns = ["qrCode", "panelId", "packingTime", "qty", "length", "width", "depth", "area", "totalArea", "color", "colorType", "userName"];
  }
  initData() {
    this.panels = this.appService.panels
    if (!this.panels) return;
    this.panels.forEach(panel => panel.userName = panel.packingStaff ? panel.packingStaff.userName : '');

    this.dataSource = new MatTableDataSource(this.panels);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    // this.spinner.hide();
  }

  @ViewChild('table') table: ElementRef;

  ngAfterViewInit() { }

  get tableHeight() {
    if (this.table) {
      let height = (this.table as any)._elementRef.nativeElement.offsetHeight;
      if (height > 0)
        return height
    }
    return 500
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openPanelDialog(panel: Panel) {

  }

  deletePanel(id: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      data: {
        title: "Confirm Action",
        text: "Are you sure you want remove this panel?"
      }
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.appService.deletePanel(id)
      }
    });
  }

  exportAsXLSX(): void {
    const data: ExportSheet = new ExportSheet();

    // header row
    const headerRow: Array<any> = new Array<any>();
    headerRow.push('');
    headerRow.push('Panel Id');
    headerRow.push('Packing Time');
    headerRow.push('Qty.');
    headerRow.push('Length');
    headerRow.push('Width');
    headerRow.push('Depth');
    headerRow.push('Area');
    headerRow.push('Total Area');
    headerRow.push('Colour');
    headerRow.push('Colour Type');
    headerRow.push('Staff');

    data.push(headerRow);
    // Item rows
    let sortedFilteredData = this.dataSource.sortData(this.dataSource.filteredData, this.dataSource.sort);
    for (const panel of sortedFilteredData) {
      const row: Array<any> = new Array<any>();
      row.push('');
      row.push(panel.panelId);
      row.push(this.formatTime(panel.packingTime));
      row.push(panel.qty);
      row.push(panel.length);
      row.push(panel.width);
      row.push(panel.depth);
      row.push(panel.area);
      row.push(panel.totalArea);
      row.push(panel.color);
      row.push(panel.colorType);
      row.push(panel.userName);
      data.push(row);
    }
    const name = `Job-${this.appService.currentJob.jobNumber}`;
    (new ExportService()).exportAsExcelFile(data, name);
  }

  formatTime(time: string) {
    if (!time) {
      return ''
    }
    if (time === "0001-01-01T00:00:00") {
      return ''
    }
    return moment.utc(time).local().format('ddd DD/MMM/YYYY  HH:mm:ss');
  }

  refresh() {
    this.appService.getPanels()
  }
}
