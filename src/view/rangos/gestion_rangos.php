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
    <a class="nav-link" href="../tareas/gestion_tareas.php">Tareas</a>
  </li>
  <li class="nav-item">
    <a class="nav-link  active" aria-current="page" href="../rangos/gestion_rangos.php"><strong>Rangos</strong></a>
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
<a href="agregar_rango.php">AGREGAR NUEVA RANGO</a>
<br>
<br>
<table border="1px" class="table table-striped-columns">
		<thead>
			<tr>
				<th>ID RANGO</th>
				<th>RANGOS</th>
				<th>PUNTOS MINIMOS</th>
				<th>PUNTOS MAXIMOS</th>
				<th>ACCIONES</th>
				<tbody>
					<?php  

							require ('../../models/conectar.php');
						$consulta="SELECT * FROM rangos";
						$resultado=$Conexion->query($consulta);
						while ($fila =$resultado->fetch()){
						?>
						<tr>
							<td><?php  echo $fila['id_rango'];?></td>
							<td><?php  echo $fila['nombre_rango'];?></td>
							<td><?php  echo $fila['puntos_minimos'];?></td>
							<td><?php  echo $fila['puntos_maximos'];?></td>
                            <td><a href="actualizar_rango.php?id_rango=<?php echo $fila['id_rango']; ?>"><img src="../assets/pen-to-square-solid.svg" width="30px" alt=""></a>
							<a href="../../controllers/rangos/eliminar_rango.php?id_rango=<?php echo $fila['id_rango']; ?>"><img src="../assets/trash-solid.svg" width="30px" alt=""></a>
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