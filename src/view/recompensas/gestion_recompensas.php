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
    <a class="nav-link " href="../usuarios/gestion_usuarios.php">Usuarios</a>
  </li>
  <li class="nav-item">
    <a class="nav-link " href="../tareas/gestion_tareas.php">Tareas</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" href="../rangos/gestion_rangos.php">Rangos</a>
  </li>
  <li class="nav-item">
    <a class="nav-link active" aria-current="page" href="../recompensas/gestion_recompensas.php"><strong>Recompensas</strong></a>
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
<a href="agregar_recompensa.php">AGREGAR NUEVA RECOMPENSA</a>
<br>
<br>
<table border="1px" class="table table-striped-columns">
		<thead>
			<tr>
				<th>ID RECOMPENSA</th>
				<th>RECOMPENSA</th>
				<th>PUNTOS NECESARIOS</th>
				<th>STOCK</th>
				<th>ACCIONES</th>
				<tbody>
					<?php  

							require ('../../models/conectar.php');
						$consulta="SELECT * FROM recompensas";
						$resultado=$Conexion->query($consulta);
						while ($fila =$resultado->fetch()){
						?>
						<tr>
							<td><?php  echo $fila['id_recompensa'];?></td>
							<td><?php  echo $fila['nombre'];?></td>
							<td><?php  echo $fila['puntos_necesarios'];?></td>
							<td><?php  echo $fila['stock'];?></td>
                            <td><a href="actualizar_recompensa.php?id_recompensa=<?php echo $fila['id_recompensa']; ?>"><img src="../assets/pen-to-square-solid.svg" width="36px" alt=""></a>
							<a href="../../controllers/recompensas/eliminar_recompensa.php?id_recompensa=<?php echo $fila['id_recompensa']; ?>"><img src="../assets/trash-solid.svg" width="36px" alt=""></a>
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