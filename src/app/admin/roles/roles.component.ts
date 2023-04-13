import { Component, OnInit } from '@angular/core';
import { Rol } from './roles';
import { RolesService } from 'src/app/_services/roles.service';
import { MatDialog } from '@angular/material/dialog';
import { RolesDialogComponent } from './roles-dialog/roles-dialog.component';
import { AdminService } from '../../_services/admins.service';
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
    public AdminService:AdminService,
    public  rolesService:RolesService,
    public dialog:MatDialog
  ) { }

  ngOnInit(): void {
    this.AdminService.getAllRoles().subscribe(resp=>{
      console.log(resp.response)
      this.roles=resp.response;
    }, error=>{console.error(error)})
  }
  public filtrarTodos() {
    window.location.reload();
  }
  public filtrarActivos() {
    this.AdminService.getRolesActivos().subscribe(resp => {
      console.log(resp.response)
      this.roles = resp.response
    })
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
