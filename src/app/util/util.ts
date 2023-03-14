import Swal from "sweetalert2";

export class Util {
  public static errorMessage(mensaje: string) {
    Swal.close();
    Swal.fire({
      icon: "error",
      text: mensaje,
      showConfirmButton: true,
    });
  }

  public static successMessage(mensaje: string) {
    Swal.close();
    Swal.fire({
      icon: "success",
      text: mensaje,
      showConfirmButton: true,
    });
  }

  public static confirmMessage(mensaje: string, do_) {
    Swal.fire({
      title: mensaje,
      showConfirmButton: false,
      showDenyButton: true,
      showCancelButton: true,
      denyButtonText: "SI",
      cancelButtonText: "NO",
    }).then((result) => {
      if (result.isDenied) {
        do_();
      }
    });
  }
}
