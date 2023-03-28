import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { PreguntaFrecuente } from '../../models/preguntaFrecuente.model';
import { AdminService } from '../../_services/admins.service';

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {
  public preguntasFrecuentes: PreguntaFrecuente[]=[];
  public page: any;
  public count = 6;

  constructor(
    public dialog: MatDialog,
    public adminService:AdminService
    ) { }

  ngOnInit(): void {
    this.adminService.getAllPreguntas().subscribe(resp=>{
      console.log(resp.response)
      this.preguntasFrecuentes=resp.response;
    }, error=>{console.error(error)})
  }

  public onPageChanged(event){
    this.page = event; 
    window.scrollTo(0,0); 
  }
  /*
  public openRolesDialog(data:any){
    const dialogRef = this.dialog.open(RolesDialogComponent,{
      data: data // Pasa la variable data al diálogo
    });
    
  }*/

  public remove(follower:any){  

  }

}
