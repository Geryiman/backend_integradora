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
<a href="gestion_usuarios.php">Regresar</a>
<?php
			require('../../models/conectar.php');
			$id_registro = $_REQUEST['id_usuario'];
			$consulta="SELECT * FROM usuarios WHERE id_usuario='$id_registro'";
			$resultado=$Conexion->query($consulta);
			while($fila=$resultado->fetch()){
			?>
	
	<div class="contenedor-form-registro mt-5">
        <div class="card text-center">
            <div class="card-header">
                <strong>Actualizacion de datos</strong>
            </div>
            <div class="card-body">

	<form action="../../controllers/usuarios/proceso_actualizar_usuario.php?id_usuario=<?php echo $fila['id_usuario']; ?>" method="POST" enctype="multipart/form-data">
	
    <?php } ?>    

    <?php
//--------nombre ------------------- 
	$id_registro = $_REQUEST['id_usuario'];
	$consulta="SELECT nombre FROM usuarios WHERE id_usuario = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
        
		<input type="text" name="nombre" value="<?php echo $fila['nombre'];?>" required='' class="form-control mb-3" placeholder="Nombre">
		


        <?php
//--------email ------------------- 
	$id_registro = $_REQUEST['id_usuario'];
	$consulta="SELECT email FROM usuarios WHERE id_usuario = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
        
		<input type="email" name="email" value="<?php echo $fila['email'];?>" required='' class="form-control mb-3" placeholder="Correo Electrónico">
		


        <?php
//--------password ------------------- 
	$id_registro = $_REQUEST['id_usuario'];
	$consulta="SELECT password FROM usuarios WHERE id_usuario = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
        
		<input type="password" name="password" value="<?php echo $fila['password'];?>" required='' class="form-control mb-3" placeholder="Contraseña">
		
        

        <?php
//--------puntos ------------------- 
	$id_registro = $_REQUEST['id_usuario'];
	$consulta="SELECT puntos_totales FROM usuarios WHERE id_usuario = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
        
		<input type="number" name="puntos" value="<?php echo $fila['puntos_totales'];?>" required='' class="form-control mb-3" placeholder="Puntos">
		
	
		<?php
//--------Imagen ------------------- 
	$id_registro = $_REQUEST['id_usuario'];
	$consulta="SELECT profileImage FROM usuarios WHERE id_usuario = '$id_registro'";
	$resultado = $Conexion->prepare($consulta);
	$resultado->execute();
	$fila=$resultado->fetch();
	?>
		
		<img src="<?php echo $fila['profileImage']; ?>" width="100"><br><br>
		<input type="hidden" name="foto_actual" value="<?php echo $fila['profileImage']; ?>">
		<input type="file" name="imagen" value="<?php echo $fila['profileImage'];?>" class="form-control mb-3">

		<input type="submit" value="ACTUALIZAR" class="btn btn-primary">
	</form>
	</div>
        </div>
    </div>
</body>
</html>