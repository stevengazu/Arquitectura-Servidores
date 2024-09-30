const express   = require('express');
const employees = require('./employees.json');
const app = express();

app.use(express.json());

const port =  process.env.PORT || 8000;

app.get('/api/employees', (req, res) => {
    let resultEmployees = [];
    if (req.query.page) {
        // Obtener el número de página de los parámetros de la consulta, por defecto 1 si no se proporciona
        const page = parseInt(req.query.page) || 1;
        
        // Establecer el límite de empleados por página
        const limit = 2;

        // Calcular el índice de inicio del array de empleados para la página actual
        const startIndex = 2 * (page - 1);

        // Calcular el índice final del array de empleados para la página actual
        const endIndex = startIndex + 2;

        // Cortar el array de empleados para obtener los empleados de la página actual
        resultEmployees = employees.slice(startIndex, endIndex);
    } else if (req.query.user) {
        // Filtrar los empleados por privilegios si se proporciona el parámetro user
        resultEmployees = employees.filter(employee => employee.privileges === 'user');
    } else if (req.query.badges) {
        // Filtrar los empleados por badges si se proporciona el parámetro badges
        resultEmployees = employees.filter(employee => employee.badges && employee.badges.includes(req.query.badges));
    }
    
    // Enviar los empleados resultantes como una respuesta JSON con un código de estado 200
    res.status(200).json(resultEmployees);
});



app.post('/api/employees', (req, res) => {
    const newEmployee = req.body;

    // Validar que el nuevo empleado tenga el mismo formato JSON que el resto de empleados
    if (!newEmployee.id || !newEmployee.name || !newEmployee.age || !newEmployee.privileges) {
        return res.status(400).json({ code: "bad_request" });
    }

    // Añadir el nuevo empleado al listado en memoria
    employees.push(newEmployee);

    // Enviar el nuevo empleado como una respuesta JSON con un código de estado 201
    res.status(201).json(newEmployee);
});

app.get('/api/employees/oldest', (req, res) => {
    // Ordenar los empleados por edad en orden descendente
    const oldestEmployees = employees.sort((a, b) => b.age - a.age);
    
    // Obtener el empleado más antiguo (el primero en la lista ordenada)
    const oldestEmployee = oldestEmployees[0];
    
    // Enviar el empleado más antiguo como una respuesta JSON con un código de estado 200
    res.status(200).json(oldestEmployee);
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});