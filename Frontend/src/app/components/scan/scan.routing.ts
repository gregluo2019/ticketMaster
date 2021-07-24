import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ScannerComponent } from "./scanner/scanner.component";

const myRoute: Routes = [
  { path: "", component: ScannerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(myRoute)],
  exports: [RouterModule],
})
export class ScanRoutingModule { }
