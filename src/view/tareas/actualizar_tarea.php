<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
	<link rel="stylesheet" href="../../bootstrap/css/bootstrap.min.css">
	<link rel="stylesheet" href="styles/general.css">
</head>
<body>
<a href="gestion_tareas.php">Regresar</a>

<?php
			require('../../models/conectar.php');
			$id_registro = $_REQUEST['id_tarea'];
			$consulta="SELECT * FROM tareas WHERE id_tarea='$id_registro'";
			$resultado=$Conexion->query($consulta);
			while($fila=$resultado->fetch()){
			?>
	
	<div class="contenedor-form-registro mt-5">
        <div class="card text-center">
            <div class="card-header">
                <strong>Actualizacion de Tarea</strong>
            </div>
            <div class="card-body">

	<form action="../../controllers/tareas/proceso_actualizar_tarea.php?id_tarea=<?php echo $fila['id_tarea']; ?>" method="POST" enctype="multipart/form-data">
	
    <?php } ?>    

    <?php
//--------tarea (descripcion) ------------------- 
	$id_registro = $_REQUEST['id_tarea'];
	$consulta="SELECT descripcion FROM tareas WHERE id_tarea = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
		<input type="text" name="tarea" value="<?php echo $fila['descripcion'];?>" required='' class="form-control mb-3" placeholder="Tarea (descripción)">

        <?php
//--------puntos ------------------- 
	$id_registro = $_REQUEST['id_tarea'];
	$consulta="SELECT puntos FROM tareas WHERE id_tarea = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
        
		<input type="number" name="puntos" value="<?php echo $fila['puntos'];?>" required='' class="form-control mb-3" placeholder="Puntos">

		<?php
//--------tipo ------------------- 
	$id_registro = $_REQUEST['id_tarea'];
	$consulta="SELECT puntos FROM tareas WHERE id_tarea = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
        
		<label>Tipo de Tarea</label><br>
        <select name="tipo" class="form-control mb-3" placeholder="<?php echo $fila['tipo'];?>">
			<option value="Normal">Normal</option>
			<option value="Especial">Especial</option>
		</select>


        <?php
//--------fechaInicio ------------------- 
	$id_registro = $_REQUEST['id_tarea'];
	$consulta="SELECT fecha_inicio FROM tareas WHERE id_tarea = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
		<input type="datetime-local" name="fechaInicio" value="<?php echo $fila['fecha_inicio'];?>" required='' class="form-control mb-3">


        <?php
//--------fechaFin ------------------- 
	$id_registro = $_REQUEST['id_tarea'];
	$consulta="SELECT fecha_fin FROM tareas WHERE id_tarea = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
		<input type="datetime-local" name="fechaFin" value="<?php echo $fila['fecha_fin'];?>" required='' class="form-control mb-3">



		<?php
//--------Botellas Necesarias ------------------- 
	$id_registro = $_REQUEST['id_tarea'];
	$consulta="SELECT botellas_necesarias FROM tareas WHERE id_tarea = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
        
		<input type="number" name="botellas" value="<?php echo $fila['botellas_necesarias'];?>" required='' class="form-control mb-3" placeholder="Puntos">



		<input type="submit" value="ACTUALIZAR" class="btn btn-primary">
	</form>
	</div>
        </div>
    </div>
</body>
</html>