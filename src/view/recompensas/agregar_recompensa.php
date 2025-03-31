<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registrar recompensa</title>
    <link rel="stylesheet" href="../../bootstrap/css/bootstrap.min.css">
    <link rel="stylesheet" href="styles/general.css">
</head>
<body>
    <a href="gestion_recompensas.php">Regresar</a>
    <div class="contenedor-form-registro mt-5">
        <div class="card text-center">
            <div class="card-header">
                <strong>Registro de Recompensa</strong>
            </div>
            <div class="card-body">
    <form action="../../controllers/recompensas/proceso_agregar_recompensa.php" method="POST">
        
        <input type="text" name="recompensa" id="recompensa" class="form-control mb-3" placeholder="Nombre de Recompensa">
        
        <input type="number" name="puntos" id="puntos" class="form-control mb-3" placeholder="Puntos Necesarios">

        <input type="number" name="stock" id="stock" class="form-control mb-3" placeholder="Stock">
        
        <input type="submit" value="AGREGAR RECOMPENSA" class="btn btn-primary">
    </form>
    </div>
        </div>
    </div>
</body>
</html>