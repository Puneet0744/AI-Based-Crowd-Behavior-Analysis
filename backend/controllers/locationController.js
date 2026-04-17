const { db } = require('../config/firebase');

exports.updateLocation = async (req, res) => {
  try {
    const { userId, latitude, longitude, timestamp } = req.body;

    if (!userId || latitude === undefined || longitude === undefined || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const locationLog = {
      userId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timestamp: new Date(timestamp).toISOString(),
      createdAt: new Date().toISOString()
    };

    await db.collection('location_logs').add(locationLog);

    return res.status(200).json({ message: 'Location updated successfully' });
  } catch (error) {
    console.error('Error updating location:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getHeatmap = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const snapshot = await db.collection('location_logs').get();
    
    const heatmapData = [];
    snapshot.forEach(doc => {
      const data = doc.data();
      heatmapData.push({
        lat: data.latitude,
        lng: data.longitude,
        intensity: 1 // default intensity, can be adjusted based on multiple users in same spot
      });
    });

    return res.status(200).json(heatmapData);
  } catch (error) {
    console.error('Error fetching heatmap data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
