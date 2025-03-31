<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestionar tareas</title>
	<link rel="stylesheet" href="../../bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" href="styles/general.css">
</head>
<body>

<ul class="nav nav-tabs py-2">
  <li class="nav-item">
    <a class="nav-link" href="../interfaz_admin.php">Perfil</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="../usuarios/gestion_usuarios.php">Usuarios</a>
  </li>
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="../tareas/gestion_tareas.php"><strong>Tareas</strong></a>
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
<a href="agregar_tarea.php">AGREGAR NUEVA TAREA</a>
<br>
<br>
<table border="1px" class="table table-striped-columns">
		<thead>
			<tr>
				<th>ID TAREA</th>
				<th>DESCRIPCION</th>
				<th>PUNTOS</th>
				<th>TIPO</th>
				<th>INICIO</th>
				<th>FIN</th>
				<th>BOTELLAS NECESARIAS</th>
				<th>ACCIONES</th>
				<tbody>
					<?php  

							require ('../../models/conectar.php');
						$consulta="SELECT * FROM tareas";
						$resultado=$Conexion->query($consulta);
						while ($fila =$resultado->fetch()){
						?>
						<tr>
							<td><?php  echo $fila['id_tarea'];?></td>
							<td><?php  echo $fila['descripcion'];?></td>
							<td><?php  echo $fila['puntos'];?></td>
							<td><?php  echo $fila['tipo'];?></td>
							<td><?php  echo $fila['fecha_inicio'];?></td>
							<td><?php  echo $fila['fecha_fin'];?></td>
							<td><?php  echo $fila['botellas_necesarias'];?></td>
                            <td><a href="actualizar_tarea.php?id_tarea=<?php echo $fila['id_tarea']; ?>"><img src="../assets/pen-to-square-solid.svg" width="36px" alt=""></a>
							<a href="../../controllers/tareas/eliminar_tarea.php?id_tarea=<?php echo $fila['id_tarea']; ?>"><img src="../assets/trash-solid.svg" width="36px" alt=""></a>
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