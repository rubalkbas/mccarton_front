import { Component, OnInit } from '@angular/core';
import { Rol } from './roles';
import { RolesService } from 'src/app/_services/roles.service';
import { MatDialog } from '@angular/material/dialog';
import { RolesDialogComponent } from './roles-dialog/roles-dialog.component';
@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit {

  roles: Rol[] = [];
  public count : 6;
  public page: any;


  constructor(
    public  rolesService:RolesService,
    public dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.rolesService.getAllRoles().subscribe(resp=>{
      console.log(resp.response)
      this.roles=resp.response;
    }, error=>{console.error(error)})
  }
  public openRolesDialog(data:any){
    const dialogRef = this.dialog.open(RolesDialogComponent,{
      data: data // Pasa la variable data al diálogo
    });
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }
}
