<?php
	require('../models/conectar.php');
	session_start();
	
	if(isset($_SESSION["id_usuario"])){
		header("Location: index.php");
	}
	echo 'Aqui';
	if(!empty($_POST))
	{
		$usuario = $_POST['usuario'];
		$password = $_POST['password'];
		$error = '';
		echo $usuario;
		
		
		$sql = "SELECT id_usuario, nombre, email, password, puntos_totales, id_tipo FROM usuarios WHERE nombre = '$usuario' AND password = '$password'";
		$resultado = $Conexion->query($sql);
		$rows = $resultado->rowCount();
		
		if($rows > 0) {
			$row = $resultado->fetch();
			$_SESSION['ID_USUARIO'] = $row['id_usuario'];
			$_SESSION['ID_TIPO'] = $row['id_tipo'];
			$_SESSION['NOMBRE'] = $row['nombre'];
			$_SESSION['EMAIL'] = $row['email'];
			//$_SESSION['TIPO'] = $row['tipo'];
			$_SESSION['TIEMPO'] = time() ;
				$inactivo = 60;

				if(isset($_SESSION['TIEMPO']) ) {
				$vida_session = time() - $_SESSION['TIEMPO'];
				if($vida_session > $inactivo)
				{
				session_destroy();
				header("Location: ../index.php" ) ;
				}
				}


				if ($row['id_tipo']==2) {
					
					header("location:../view/interfaz_admin.php");
				}
				
				elseif ($row['id_tipo']==1) {
					
					echo '<script language="javascript">alert("ACCESO NO AUTORIZADO");window.location.href="../index.php"</script>';
					//header("location:../index.php");
				}

			
			echo $row['id_tipo']."<br>";
			
			} else {
			$error = "El nombre o contraseña son incorrectos";
			echo '<script language="javascript">alert("USUARIO O PASSWORD INCORRECTOS, INTENTELO NUEVAMENTE");window.location.href="../index.php"</script>';

			}
	}
?>