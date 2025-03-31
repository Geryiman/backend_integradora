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
<a href="gestion_rangos.php">Regresar</a>

<?php
			require('../../models/conectar.php');
			$id_registro = $_REQUEST['id_rango'];
			$consulta="SELECT * FROM rangos WHERE id_rango='$id_registro'";
			$resultado=$Conexion->query($consulta);
			while($fila=$resultado->fetch()){
			?>
	
	<div class="contenedor-form-registro mt-5">
        <div class="card text-center">
            <div class="card-header">
                <strong>Actualizacion de Rango</strong>
            </div>
            <div class="card-body">

	<form action="../../controllers/rangos/proceso_actualizar_rango.php?id_rango=<?php echo $fila['id_rango']; ?>" method="POST" enctype="multipart/form-data">
	
    <?php } ?>    

    <?php
//--------Nombre rango------------------- 
	$id_registro = $_REQUEST['id_rango'];
	$consulta="SELECT nombre_rango FROM rangos WHERE id_rango = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
		<input type="text" name="rango" value="<?php echo $fila['nombre_rango'];?>" required='' class="form-control mb-3" placeholder="Nombre del Rango">

        <?php
//--------Puntos minimos------------------- 
	$id_registro = $_REQUEST['id_rango'];
	$consulta="SELECT puntos_minimos FROM rangos WHERE id_rango = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
		<input type="number" name="puntosmin" value="<?php echo $fila['puntos_minimos'];?>" required='' class="form-control mb-3" placeholder="Puntos Minimos">

		<?php
//--------Puntos maximos------------------- 
	$id_registro = $_REQUEST['id_rango'];
	$consulta="SELECT puntos_maximos FROM rangos WHERE id_rango = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
		<input type="number" name="puntosmax" value="<?php echo $fila['puntos_maximos'];?>" required='' class="form-control mb-3" placeholder="Puntos Maximos">

		<input type="submit" value="ACTUALIZAR" class="btn btn-primary">
	</form>

	</div>
        </div>
    </div>
</body>
</html>