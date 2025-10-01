const express = require('express');
const router = express.Router();
const employeeController = require('../controller/employee'); // Update path if needed

// Auth Routes
router.post('/signup', employeeController.signup);
router.post('/login', employeeController.login);
router.post('/logout', employeeController.logout);

// Employee Routes
router.get('/getAll', employeeController.getAllEmployees);
router.patch('/verify/:id', employeeController.verifyEmployee); // 👈 New route to verify employee
router.post('/addVisaId/:id/add-visa', employeeController.addVisaId);
router.post('/addApplicationId/:id/add-application', employeeController.addApplicationId); // New route for individual application assignment
router.post('/removeApplicationId/:id/remove-application', employeeController.removeApplicationId); // New route to remove application assignment
router.get('/getByUserId/:userId/visas', employeeController.getUserVisaDetails);

router.get('/getById/:id', employeeController.getEmployeeById);
router.delete('/delete/:id', employeeController.deleteEmployeeById);
router.put('/upadtebyId/:id', employeeController.updateEmployeeById);

router.get('/points/:id', employeeController.getEmployeePoints);
router.post('/migrate-visa-to-application-ids', employeeController.migrateVisaIdsToApplicationIds); // Migration endpoint

module.exports = router;
