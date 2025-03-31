<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestionar usuarios</title>
	<link rel="stylesheet" href="../../bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" href="styles/general.css">
</head>
<body>

<ul class="nav nav-tabs py-2">
  <li class="nav-item">
    <a class="nav-link" href="../interfaz_admin.php">Perfil</a>
  </li>
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="usuarios/gestion_usuarios.php"><strong>Usuarios</strong></a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="../tareas/gestion_tareas.php">Tareas</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="../rangos/gestion_rangos.php">Rangos</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="../recompensas/gestion_recompensas.php">Recompensas</a>
  </li>
  <li class="nav-item float-end ms-auto me-3">
	<a class="btn btn-danger" href="../../controllers/cerrar_sesion.php">Cerrar sesion</a>
  </li>
</ul>

<br>
<br>
<!-- <a href="../interfaz_admin.php">Regresar</a> -->
<br>


<div class="contenedor">
<a href="registro_usuario.php">Agregar usuario</a>
<br>
<br>
<table border="1px" class="table table-striped-columns">
		<thead>
			<tr>
				<th>ID USUARIO</th>
				<th>NOMBRE</th>
				<th>EMAIL</th>
				<th>PASSWORD</th>
				<th>PUNTOS TOTALES</th>
				<th>IMAGEN</th>
				<th>ACCIONES</th>

				<tbody>
					<?php  

							require ('../../models/conectar.php');
						$consulta="SELECT id_usuario, nombre, email, password, puntos_totales, profileImage, tipo
                                    FROM usuarios JOIN tipoUsuarios ON usuarios.id_tipo=tipoUsuarios.id_tipo
                                    WHERE usuarios.id_tipo = 1;";
						$resultado=$Conexion->query($consulta);
						while ($fila =$resultado->fetch()){
						?>
						<tr>
							<td><?php  echo $fila['id_usuario'];?></td>
							<td><?php  echo $fila['nombre'];?></td>
							<td><?php  echo $fila['email'];?></td>
							<td><?php  echo $fila['password'];?></td>
							<td><?php  echo $fila['puntos_totales'];?></td>
							<td><?php  echo '<img src="'.$fila['profileImage'].'" width="100px" height="100px">'?></td>
                            <td><a href="actualizar_usuario.php?id_usuario=<?php echo $fila['id_usuario']; ?>"><img src="../assets/pen-to-square-solid.svg" width="36px" alt=""></a>
							<a href="../../controllers/usuarios/eliminar_usuario.php?id_usuario=<?php echo $fila['id_usuario']; ?>"><img src="../assets/trash-solid.svg" width="36px" alt=""></a>
							</td>
						</tr>
						<?php  
							}
						?>	
				</tbody>
			</tr>
		</thead>
	</table>
	</div>
<script src="../../bootstrap/js/bootstrap.min.js"></script>
</body>
</html>