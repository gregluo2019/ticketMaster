import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { ContactComponent } from "./contact.component";
import { ContactService } from "./contact.service";
import { RouterModule } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatSnackBarModule } from "@angular/material/snack-bar";

const routes = [{ path: '', component: ContactComponent }];

@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSnackBarModule,
    RouterModule.forChild(routes),
  ],
  exports: [ContactComponent],
  entryComponents: [ContactComponent],
  providers: [ContactService]
})
export class ContactModule { }
