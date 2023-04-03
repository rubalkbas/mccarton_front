import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-imagen-dialog',
  templateUrl: './imagen-dialog.component.html',
  styleUrls: ['./imagen-dialog.component.scss']
})
export class ImagenDialogComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imagen: any }) {}
  imagenBase64;



  ngOnInit(): void {
    this.imagen();
  }

  imagen() {
    this.imagenBase64= this.data.imagen;
  }

}
