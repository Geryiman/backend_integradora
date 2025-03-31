<?php  
	require ('../../models/conectar.php');
	$nombre = $_POST['nombre'];
	$email = $_POST['email'];
	$password = $_POST['password'];
	$tipo = 1;
	$foto = $_FILES['imagen']['name'];
    $ruta = $_FILES['imagen']['tmp_name'];
    $destino ="../../Fotos/".$foto;

    copy ($ruta,$destino);

		$insertar = "INSERT INTO usuarios (id_usuario, nombre, email, password, puntos_totales, profileImage, id_tipo) VALUES
        (null,'$nombre','$email','$password',0,'$destino','$tipo')";

	$resultado=$Conexion->prepare($insertar);
	$resultado->execute();

	if ($resultado) {
		
		echo '<script language="javascript">alert("REGISTRO GUARDADO");window.location.href="../../view/usuarios/gestion_usuarios.php"</script>';
	}else
	{
	echo "Fallo la insercion";
	}
?>