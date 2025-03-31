<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar usuario</title>
    <link rel="stylesheet" href="../../bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/general.css">
</head>
<body>
    <a href="gestion_tareas.php">Regresar</a>
    <div class="contenedor-form-registro mt-5">
        <div class="card text-center">
            <div class="card-header">
                <strong>Registro de Tarea</strong>
            </div>
            <div class="card-body">
    <form action="../../controllers/tareas/proceso_registro_tarea.php" method="POST">
        
        <input type="text" name="tarea" id="tarea" class="form-control mb-3" placeholder="Nombre de Tarea">

        <input type="number" name="puntos" id="puntos" class="form-control mb-3" placeholder="Puntos">

        <label>Tipo de Tarea</label><br>
        <select name="tipo" class="form-control mb-3">
			<option value="Normal">Normal</option>
			<option value="Especial">Especial</option>
		</select>
        
        <label>Inicio</label><br>
        <input type="date" name="fechaInicio" id="fechaInicio" class="form-control mb-3" placeholder="Fecha de inicio">
        
        <label>Fin</label><br>
        <input type="date" name="fechaFin" id="fechaFin" class="form-control mb-3" placeholder="Fecha fin">
        
        <input type="number" name="botellas" id="botellas" class="form-control mb-3" placeholder="Botellas Necesarias">
        
        <input type="submit" value="AGREGAR TAREA" class="btn btn-primary">
    </form>
    </div>
        </div>
    </div>
</body>
</html>