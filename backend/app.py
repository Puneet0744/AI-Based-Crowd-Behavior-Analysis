from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime

app = Flask(__name__)
CORS(app)

# -----------------------------
# In-memory storage
# -----------------------------
users = {}

zones = [
    {
        "id": "zone1",
        "type": "danger",
        "polygon": [
            (12.821939, 80.044166),
            (12.821475, 80.043224),
            (12.822849, 80.043272),
            (12.822858, 80.044232)
        ]
    }
]

alerts = [
{
  "type": "sos",
  "message": "User3 triggered SOS",
  "timestamp": "14:47:02"
}]

# -----------------------------
# Geofencing Logic
# -----------------------------
def is_inside(user, polygon):
    count = 0
    for i in range(len(polygon)):
        a = polygon[i]
        b = polygon[(i + 1) % len(polygon)]

        if (a[0] > user[0]) != (b[0] > user[0]):
            x_intersect = a[1] + (user[0] - a[0]) * (b[1] - a[1]) / (b[0] - a[0])
            if user[1] < x_intersect:
                count += 1

    return count % 2 == 1

def count_users_in_zone(zone):
    count = 0
    for user in users.values():
        if is_inside((user["lat"], user["lon"]), zone["polygon"]):
            count += 1
    return count
# -----------------------------
# API: Receive Location
# -----------------------------
@app.route('/location', methods=['POST'])
def location():
    data = request.json

    user_id = data.get("user_id")
    lat = data.get("lat")
    lon = data.get("lon")

    user_pos = (lat, lon)

    # ✅ Update user (no individual alert here)
    users[user_id] = {
        "lat": lat,
        "lon": lon,
        "status": "safe"
    }

    # 🔥 Check crowd density per zone
    for zone in zones:
        count = 0

        # count users inside this zone
        for user in users.values():
            if is_inside((user["lat"], user["lon"]), zone["polygon"]):
                count += 1

        # threshold (you can tune this)
        THRESHOLD = 3

        if count >= THRESHOLD:
            # check if alert already exists
            existing_alert = next(
                (a for a in alerts if a.get("zone_id") == zone["id"] and a["type"] == "high_density"),
                None
            )

            if existing_alert:
                # ✅ update count (no duplicate alert)
                existing_alert["count"] = count
                existing_alert["timestamp"] = datetime.now().strftime("%H:%M:%S")
            else:
                # ✅ create new alert
                alerts.append({
                    "type": "high_density",
                    "zone_id": zone["id"],
                    "message": f"{zone['id']} is highly crowded. Monitor closely",
                    "count": count,
                    "timestamp": datetime.now().strftime("%H:%M:%S")
                })

    return jsonify({
        "message": "location updated"
    })
# -----------------------------
# API: Get Users
# -----------------------------
@app.route('/users', methods=['GET'])
def get_users():
    return jsonify(users)

# -----------------------------
# API: Get Alerts
# -----------------------------
@app.route('/alerts', methods=['GET'])
def get_alerts():
    return jsonify(alerts)

# -----------------------------
# API: Get Zones
# -----------------------------
@app.route('/zones', methods=['GET'])
def get_zones():
    return jsonify(zones)

# -----------------------------
# Run Server
# -----------------------------
if __name__ == "__main__":
    app.run(debug=True)