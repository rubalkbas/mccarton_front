import { RolesService } from './../../_services/roles.service';
import { Usuario } from './user.model';
import { UsuariosService } from './../../_services/usuarios.service';
import { Util } from './../../util/util';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AppSettings, Settings } from '../../app.settings';
import { UserDialogComponent } from './user-dialog/user-dialog.component';
import { Rol } from '../roles/roles';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class UsersComponent implements OnInit {
    public searchText: string;
    public page:number=1;
    public settings: Settings;
    public _totalElementos: number=0;

    public usuarios:Usuario[];
    public usuariosActivos:Usuario[];
    public usuariosActivosPorPagina:Usuario[];

    public _rolesLista:Rol[];

    constructor(public appSettings:AppSettings, 
                public dialog: MatDialog,
                private usuariosService: UsuariosService,
                private rolesService:RolesService){
        this.settings = this.appSettings.settings; 
    }

    ngOnInit() {
        this.consultarRoles();
        // this.listarUsuariosActivos();
        // this.listarUsuarios();
        this.listarActivosPorPagina(this.page, "idUsuario", "asc", "");
    }

    public consultarRoles(){
        this.rolesService.getAllRoles().subscribe(data=>{
            this._rolesLista=data.response;
        })
    }

    public onPageChanged(event){
        this.page = event;
        this.listarActivosPorPagina(this.page, "idUsuario", "asc", "");
    }

    listarActivosPorPagina(noPagina:number, campo:string, direccion:string, buscar:string){
        this.usuariosService.listarActivosPorPagina(noPagina, campo, direccion, buscar).subscribe(data=>{
            this.usuariosActivosPorPagina=data.response.content;
            this._totalElementos=data.response.totalElements;
        })
    }

    public openUserDialog(user:Usuario){
        let correo="";

        if(user!=null){
            correo=user.correoElectronico;
        }

        let dialogRef = this.dialog.open(UserDialogComponent, {
            data: user,
            panelClass: ['theme-dialog'],
            autoFocus: false,
            direction: (this.settings.rtl) ? 'rtl' : 'ltr'
        });

        dialogRef.afterClosed().subscribe(user => {
            if(user){
                if(user.correoElectronico==correo){
                    user.correoElectronico=null;
                }
                (user.idUsuario) ? this.actualizarUsuario(user) : this.crearUsuario(user);
            }else{
                this.listarUsuarios();
            }
        });
    }


    public listarUsuarios(){
        this.usuariosService.listarUsuarios().subscribe({next:data=>{
            this.usuarios=data.response;
            console.log("Todos los usuarios")
            console.log(data);
        }, error:error=>{
            this.usuarios=[];
            Util.errorMessage(error.error.mensaje);
        }})
    }

    public crearUsuario(usuario:Usuario){

        this.usuariosService.crearUsuario(usuario).subscribe({next:data=>{
            Util.successMessage(data.mensaje);
            this.listarUsuarios();
            console.log(data);
        }, error:error=>{
            Util.errorMessage(error.error.mensaje);
        }})
    }

    public actualizarUsuario(usuario:Usuario){
            this.usuariosService.actualizarUsuario(usuario).subscribe({next:data=>{
                Util.successMessage(data.mensaje);
                this.listarUsuarios();
                console.log(data);
            }, error:error=>{
                Util.errorMessage(error.error.mensaje);
            }
        })
    }

    public eliminarUsuario(id:number){

        console.log(id);

        this.usuariosService.eliminarUsuario(id).subscribe({next: data=> {
            if(data.ok){
                Util.successMessage(data.mensaje);
                this.listarUsuarios();
            }
            console.log(data);
        }, error: error=>{
            Util.errorMessage(error.error.mensaje)
            console.log(error)
        } 
    })
    }

    public listarUsuariosActivos(){
        this.usuariosService.listarUsuariosActivos().subscribe({next:data=>{
            this.usuariosActivos=data.response;
            console.log("Usuarios activos")
            console.log(data);
        }, error:error=>{
            this.usuariosActivos= [];
            Util.errorMessage(error.error.mensaje);
        }
        })
    }

    toggleEstatus(user:Usuario) {
        user.estatus = user.estatus === 1 ? 0 : 1;
        console.log(user)
        user.correoElectronico=null;
        this.actualizarUsuario(user);
      }
      

}