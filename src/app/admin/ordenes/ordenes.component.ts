import { Component, OnInit } from '@angular/core';
import { Ordenes } from 'src/app/models/ordenes.model';

@Component({
  selector: 'app-ordenes',
  templateUrl: './ordenes.component.html',
  styleUrls: ['./ordenes.component.scss']
})
export class OrdenesComponent implements OnInit {

  ordenes:Ordenes[]=[];

  public count : 6;
  public page: any;


  constructor() { }

  ngOnInit(): void {
  }

}
