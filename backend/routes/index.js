const express = require('express');
const router = express.Router();

const locationController = require('../controllers/locationController');
const incidentController = require('../controllers/incidentController');
const dashboardController = require('../controllers/dashboardController');
const userController = require('../controllers/userController');

// Test Route
router.get('/', (req, res) => {
  res.send('Backend is running');
});

// Location Tracking API
router.post('/location-update', locationController.updateLocation);
router.get('/heatmap', locationController.getHeatmap);

// SOS API
router.post('/sos', incidentController.createSOS);
router.get('/incidents', incidentController.getIncidents);
router.patch('/incident/:id', incidentController.resolveIncident);

// Dashboard Stats API
router.get('/dashboard-stats', dashboardController.getDashboardStats);

// Users API
router.get('/tourists', userController.getTourists);

module.exports = router;
