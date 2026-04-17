from flask import Flask, request
from flask_cors import CORS
app=Flask(__name__)

CORS(app)

polygon=[
    (12.821939409805413, 80.04416694277859), #hostel office
    (12.821475488363724, 80.04322481599857), #around adhiyaman
    (12.822849321165043, 80.04327240075102), #gate 52
    (12.82285869174765, 80.04423242347966) #around gate 51
]

def is_inside(user,polygon):
    count=0

    for i in range(len(polygon)):
        a=polygon[i]
        b=polygon[(i+1)% len(polygon)]

        if(a[0]>user[0]) !=(b[0]>user[0]):
            x_intersect= a[1]+ (user[0] - a[0])* (b[1]-a[1])/(b[0]-a[0])

            if user[1]<x_intersect:
                count+=1
    
    return count%2==1

@app.route('/location',methods=['POST'])

def location():
    print("Request Recieved")
    data=request.json
    user=(data['lat'],data['lon'])

    if is_inside(user,polygon):
        print("User is INSIDE Zone")
    else:
        print("User is OUTSIDE zone")
    
    return {"status":"recieved"}

app.run(debug=True)