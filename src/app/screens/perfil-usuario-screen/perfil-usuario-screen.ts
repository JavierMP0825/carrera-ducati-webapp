import { Component, HostListener, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '../../shared/shared.imports';
import { HeaderApp } from '../../partials/header-app/header-app';
import { LeftSidebar } from '../../partials/left-sidebar/left-sidebar';
import { FooterApp } from '../../partials/footer-app/footer-app';
import { Router } from '@angular/router';
import { RegistroUser } from '../../services/usuarios-service';

/**
 * PerfilUsuarioScreen
 * ---------------------------------------------------------
 * Pantalla que muestra el perfil del usuario registrado.
 * Carga datos desde localStorage y los muestra en una UI amigable.
 * Controla:
 * - Drawer (sidebar) igual que otras pantallas
 * - Header / Footer
 * - Foto de perfil
 * - Datos del usuario (nombre, email, teléfono, etc.)
 * - Botones de acción (Editar, Cerrar Sesión)
 */

@Component({
  selector: 'app-perfil-usuario-screen',
  imports: [
    ...SHARED_IMPORTS,
    HeaderApp,
    LeftSidebar,
    FooterApp,
  ],
  templateUrl: './perfil-usuario-screen.html',
  styleUrl: './perfil-usuario-screen.scss',
})
export class PerfilUsuarioScreen implements OnInit {

  /* =========================================================
     DRAWER / SIDEBAR
     ========================================================= */

  /** Controla opciones del sidebar */
  public isLogin = true;

  /** Controla apertura/cierre del drawer */
  public drawerOpen = false;

  /* =========================================================
     DATOS DEL USUARIO
     ========================================================= */

  /** Datos del usuario recuperados de localStorage */
  public usuario: RegistroUser | null = null;

  /* =========================================================
     RESPONSIVE (sin userAgent)
     ========================================================= */

  /** Breakpoint consistente (tablet+) */
  private readonly MOBILE_MAX = 767;

  /** Cache del estado mobile */
  private _isMobile = this.computeIsMobile();

  constructor(
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.cargarDatosUsuario();
  }

  /* =========================================================
     CARGA DE DATOS
     ========================================================= */

  /**
   * Carga los datos del usuario desde localStorage
   * Si no hay datos, redirige a registro
   */
  private cargarDatosUsuario(): void {
    try {
      const datosGuardados = localStorage.getItem('usuario_registrado');

      if (!datosGuardados) {
        console.warn('No hay datos de usuario en localStorage. Redirigiendo a registro...');
        this.router.navigate(['/app', 'registro']);
        return;
      }

      this.usuario = JSON.parse(datosGuardados) as RegistroUser;
      console.log('Datos del usuario cargados:', this.usuario);
    } catch (error) {
      console.error('Error al cargar datos del usuario:', error);
      this.router.navigate(['/app', 'registro']);
    }
  }

  /* =========================================================
     HEADER / SIDEBAR EVENTS
     ========================================================= */

  /** Evento emitido por Header */
  public toggleSidebar(): void {
    this.drawerOpen = !this.drawerOpen;
  }

  /** Evento emitido por Sidebar */
  public closeSidebar(): void {
    this.drawerOpen = false;
  }

  /* =========================================================
     TRANSFORMACIONES DE DATOS
     ========================================================= */

  /**
   * Convierte el código de estado (número) al nombre del estado
   */
  public getEstadoNombre(): string {
    const estadoMap: Record<number | string, string> = {
      1: 'Aguascalientes',
      2: 'Baja California',
      3: 'Baja California Sur',
      4: 'Campeche',
      5: 'Chiapas',
      6: 'Chihuahua',
      7: 'Ciudad de México',
      8: 'Coahuila',
      9: 'Colima',
      10: 'Durango',
      11: 'Estado de México',
      12: 'Guanajuato',
      13: 'Guerrero',
      14: 'Hidalgo',
      15: 'Jalisco',
      16: 'Michoacán',
      17: 'Morelos',
      18: 'Nayarit',
      19: 'Nuevo León',
      20: 'Oaxaca',
      21: 'Puebla',
      22: 'Querétaro',
      23: 'Quintana Roo',
      24: 'San Luis Potosí',
      25: 'Sinaloa',
      26: 'Sonora',
      27: 'Tabasco',
      28: 'Tamaulipas',
      29: 'Tlaxcala',
      30: 'Veracruz',
      31: 'Yucatán',
      32: 'Zacatecas'
    };

    const estado = this.usuario?.estado;
    return estado ? estadoMap[estado] || String(estado) : 'N/A';
  }

  /**
   * Convierte el código de grado_estudios a texto legible
   */
  public getGradoEstudios(): string {
    const gradoMap: Record<string, string> = {
      '1': 'Preparatoria',
      '2': 'Licenciatura',
      '3': 'Maestría',
      '4': 'Doctorado',
      'Preparatoria': 'Preparatoria',
      'Licenciatura': 'Licenciatura',
      'Maestría': 'Maestría',
      'Doctorado': 'Doctorado',
    };

    const grado = this.usuario?.grado_estudios;
    return grado ? gradoMap[grado] || grado : 'N/A';
  }

  /* =========================================================
     ACCIONES DE USUARIO
     ========================================================= */

  /**
   * Navega a una pantalla de edición de perfil
   * (puede implementarse después si es necesario)
   */
  public editarPerfil(): void {
    console.log('Editar perfil (funcionalidad futura)');
    alert('La edición de perfil estará disponible próximamente.');
  }

  /**
   * Cierra la sesión:
   * - Limpia localStorage
   * - Redirige a login
   */
  public cerrarSesion(): void {
    const confirmar = confirm('¿Estás seguro de que deseas cerrar sesión?');

    if (confirmar) {
      try {
        // Limpiar datos de localStorage
        localStorage.removeItem('usuario_registrado');
        localStorage.removeItem('fecha_registro');

        console.log('Sesión cerrada');

        // Redirigir a login
        this.router.navigate(['']);
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
        alert('Error al cerrar sesión. Por favor, intenta de nuevo.');
      }
    }
  }

  /* =========================================================
     CLASES DE UI
     ========================================================= */

  /**
   * Clase responsiva sin userAgent
   */
  public mobileClass(): string {
    return this._isMobile ? 'interior-mobile' : 'interior-normal';
  }

  @HostListener('window:resize')
  public onResize(): void {
    this._isMobile = this.computeIsMobile();
  }

  private computeIsMobile(): boolean {
    return window.matchMedia(`(max-width: ${this.MOBILE_MAX}px)`).matches;
  }

}

