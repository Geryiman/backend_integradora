<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar rangos</title>
    <link rel="stylesheet" href="../../bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/general.css">
</head>
<body>
    <a href="gestion_rangos.php">Regresar</a>
    <div class="contenedor-form-registro mt-5">
        <div class="card text-center">
            <div class="card-header">
                <strong>Registro de Rango</strong>
            </div>
            <div class="card-body">
    <form action="../../controllers/rangos/proceso_agregar_rango.php" method="POST">

        <input type="text" name="rango" id="rango" class="form-control mb-3" placeholder="Nombre de Rango">
        
        <input type="number" name="puntos_minimos" id="puntos_minimos" class="form-control mb-3" placeholder="Puntos Minimos">
        
        <input type="number" name="puntos_maximos" id="puntos_maximos" class="form-control mb-3" placeholder="Puntos Maximos">
        
        <input type="submit" value="AGREGAR RANGO" class="btn btn-primary">
    </form>
    </div>
        </div>
    </div>
</body>
</html>