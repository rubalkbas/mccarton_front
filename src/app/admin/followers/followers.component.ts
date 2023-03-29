import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { PreguntaFrecuente } from '../../models/preguntaFrecuente.model';
import { AdminService } from '../../_services/admins.service';
import { Util } from '../../util/util';
import { preguntaFrecuenteDialogComponent } from '../followers/pregunta-frecuente-dialog/pregunta-frecuente-dialog.component'

@Component({
  selector: 'app-followers',
  templateUrl: './followers.component.html',
  styleUrls: ['./followers.component.scss']
})
export class FollowersComponent implements OnInit {
  public preguntasFrecuentes: PreguntaFrecuente[] = [];
  public page: any;
  public count = 6;

  constructor(
    public dialog: MatDialog,
    public adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.adminService.getAllPreguntas().subscribe(resp => {
      console.log(resp.response)
      this.preguntasFrecuentes = resp.response;
    }, error => { console.error(error) })
  }

  public onPageChanged(event) {
    this.page = event;
    window.scrollTo(0, 0);
  }

  public openpreguntaFrecuenteDialog(data: any) {
    const dialogRef = this.dialog.open(preguntaFrecuenteDialogComponent, {
      data: data // Pasa la variable data al diálogo
    });

  }

  public remove(follower: any) {

    const idPreguntaFrecuente = follower.idPreguntaFrecuente;

    this.adminService.eliminarPreguntaFrecuente(idPreguntaFrecuente).subscribe(resp => {
      Util.successMessage(resp.mensaje);
      window.location.reload();
    });
  }

  public cambiarestatus(follower: any) {
    const idPreguntaFrecuente = follower.idPreguntaFrecuente;
    let estatus = follower.estatus;
    console.log(idPreguntaFrecuente, estatus);

    // Invierte el valor de estatus usando una expresión condicional if
    if (estatus === 1) {
      estatus = 0;
    } else {
      estatus = 1;
    }

    this.adminService.actualizarEstatusPregunta(idPreguntaFrecuente, estatus).subscribe(resp => {
      Util.successMessage(resp.mensaje);
      window.location.reload();
    });
  }




}
