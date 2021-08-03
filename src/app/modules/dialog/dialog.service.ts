import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DialogMessageComponent } from './components/dialog/dialog-message.component';

export interface IDialogData {
  title: string;
  message: string;
  error?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    public dialog: MatDialog,
    public router: Router
  ) { }

  public openDialog(data: IDialogData): void {
    const dialogRef = this.dialog.open(
      DialogMessageComponent,
      { data });

    dialogRef.afterClosed().subscribe(result => {
      if (data.error) {
        this.router.navigate(['error/404']);
      }
    });
  }
}
