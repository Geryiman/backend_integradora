<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Conectar</title>
</head>
<body>

	<?php

		try {
			$Conexion = new PDO('mysql:host=localhost;dbname=ecopet','root',''); //	echo "Conexion Exitosa";
		} catch (PDOException $e) {
			print "!Error!".$e->getMessage()."<br>";
			die();
		}



	?>

</body>
</html>