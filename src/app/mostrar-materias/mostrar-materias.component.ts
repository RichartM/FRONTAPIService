import { Component } from '@angular/core';
import { ApiMateriaService } from '../service/api-materia.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mostrar-materias',
  imports: [CommonModule],
  templateUrl: './mostrar-materias.component.html',
  styleUrl: './mostrar-materias.component.css',
  standalone: true
})
export class MostrarMateriasComponent {
  materias: any[] = [];
  usuarioActual: any;

  constructor(private apiService: ApiMateriaService,private router:Router) {}

  ngOnInit(): void {
    this.apiService.authenticate('root', 'root123').subscribe(
      response => {
        console.log("Respuesta del servidor de autenticación:", response);
        this.apiService.setCredentials('root', 'root123');
      
        console.log("datos cargados :D");
        this.llenarData();  
      },
      error => {
        console.error('Error de autenticación:', error);
      }
    );

    if (!this.apiService.isAuthenticated()) {
      console.log('Sesión no iniciada. Redirigiendo al login...');
      this.router.navigate(['/login']); // Redirigir al login si no está autenticado
      return;
    }else{
        console.log("Sesion inciada");
        this.usuarioActual = this.apiService.getUsuarioActual();
        console.log('Datos del usuario actual:', this.usuarioActual);
    }

   console.log("datos cargados");
   console.log('Estructura de los grupos:', this.materias);
  }
  
  llenarData(): void {
    this.apiService.getData().subscribe(
      response => {
        console.log('Respuesta del servidor:', response);
        if (response && response.materiaResponse && response.materiaResponse.materias) {
          this.materias = response.materiaResponse.materias;
          console.log('grupos cargados:', this.materias);
          
        } else {
          console.warn('Estructura de respuesta inesperada:', response);
        }

      },
      error => {
        console.error('Error al obtener los datos:', error);
        this.router.navigate(['/login']); // Redirigir si hay un error al obtener los datos
      }
    );
  }
  
  
  cerrarSesion(): void {
    sessionStorage.removeItem('usuario'); // Elimina los datos del usuario
    this.apiService.setUsuarioActual(null); // Limpia la sesión en el servicio
    console.log('Sesión cerrada');
    this.router.navigate(['/login']); // Redirige al login
  }
}
