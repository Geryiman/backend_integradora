export interface Usuario {
  id_usuario?: number;
  nombre: string;
  email: string;
  password: string;
  puntos_totales?: number;
  profileImage?: string; // ✅ Nuevo campo para la imagen de perfil
}
