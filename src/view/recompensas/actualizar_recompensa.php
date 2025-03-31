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
<a href="gestion_recompensas.php">Regresar</a>

<?php
			require('../../models/conectar.php');
			$id_registro = $_REQUEST['id_recompensa'];
			$consulta="SELECT * FROM recompensas WHERE id_recompensa='$id_registro'";
			$resultado=$Conexion->query($consulta);
			while($fila=$resultado->fetch()){
			?>

<div class="contenedor-form-registro mt-5">
        <div class="card text-center">
            <div class="card-header">
                <strong>Actualizacion de Recompensa</strong>
            </div>
            <div class="card-body">
	
	<form action="../../controllers/recompensas/proceso_actualizar_recompensa.php?id_recompensa=<?php echo $fila['id_recompensa']; ?>" method="POST" enctype="multipart/form-data">
	
    <?php } ?>    

    <?php
//--------Recompensa------------------- 
	$id_registro = $_REQUEST['id_recompensa'];
	$consulta="SELECT nombre FROM recompensas WHERE id_recompensa = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
		<input type="text" name="recompensa" value="<?php echo $fila['nombre'];?>" required='' class="form-control mb-3" placeholder="Recompensa">

        <?php
//--------Puntos necesarios------------------- 
	$id_registro = $_REQUEST['id_recompensa'];
	$consulta="SELECT puntos_necesarios FROM recompensas WHERE id_recompensa = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
		<input type="number" name="puntos" value="<?php echo $fila['puntos_necesarios'];?>" required=''  class="form-control mb-3" placeholder="Puntos Necesarios">


        <?php
//--------Stock------------------- 
	$id_registro = $_REQUEST['id_recompensa'];
	$consulta="SELECT stock FROM recompensas WHERE id_recompensa = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
		<input type="number" name="stock" value="<?php echo $fila['stock'];?>" required=''  class="form-control mb-3" placeholder="Puntos Necesarios">


		<input type="submit" value="ACTUALIZAR" class="btn btn-primary">
	</form>

	</div>
        </div>
    </div>
</body>
</html>