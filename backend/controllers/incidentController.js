const { db } = require('../config/firebase');

exports.createSOS = async (req, res) => {
  try {
    const { userId, latitude, longitude, timestamp } = req.body;

    if (!userId || latitude === undefined || longitude === undefined || !timestamp) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const incidentData = {
      userId,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      timestamp: new Date(timestamp).toISOString(),
      status: 'ACTIVE',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('incidents').add(incidentData);

    return res.status(200).json({ message: 'SOS alert triggered successfully', incidentId: docRef.id });
  } catch (error) {
    console.error('Error creating SOS:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getIncidents = async (req, res) => {
  try {
    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    const snapshot = await db.collection('incidents').orderBy('timestamp', 'desc').get();
    
    const incidents = [];
    snapshot.forEach(doc => {
      incidents.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return res.status(200).json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

exports.resolveIncident = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Incident ID is required' });
    }

    if (!db) return res.status(500).json({ error: 'Database not initialized' });

    await db.collection('incidents').doc(id).update({
      status: 'RESOLVED',
      resolvedAt: new Date().toISOString()
    });

    return res.status(200).json({ message: 'Incident resolved successfully' });
  } catch (error) {
    console.error('Error updating incident:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
