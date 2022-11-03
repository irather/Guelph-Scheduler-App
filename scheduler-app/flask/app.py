from flask import Flask, render_template, jsonify, request


app = Flask(__name__,static_folder='../build',static_url_path='/')

# Example endpoint
@app.route('/api/profile')
def my_profile():
    response_body = {
        "name": "Brandon",
        "about" :"God I hope this works"
    }

    return response_body

# Example endpoint
@app.route('/api/response_1')
def response_1():
    response_body = {
        "header": "Scheduler",
        "body" :"This week's schedule"
    }

    return response_body

# Dummy endpoint to grab list of courses
@app.route('/api/getCourseList')
def getCourseList():
    response_body = { 
        "list": ["ACCT*1220*0101", "CIS*3760*0101"]
    }
    return response_body

# Dummy endpoint to return course name and it's meetings
@app.route('/api/course/<course>/section/<section>')
def courses(course, section):
    # this should obviously be populated with real data later on
    # TODO: maybe later find out a better way to store scheduling data instead of 
    #       a raw string and grabbing substrings
    response_body = {
        "course_name_section": "ACCT*1220*0101",
        "meetings": {
            "SEM": "Mon 04:30PM - 05:20PM MCKN, Room 225",
            "LEC": "Fri 08:30AM - 10:20AM, Room 104",
            "LAB": "",
            "EXAM": "Tues 08:30AM - 10:30AM (2022/12/06) Room TBA"
        }
    }
    return response_body

#@app.route('/')
#def index():
#        return render_template("index.html")


#function that obtains the course name the name can be changed to a more fitting name
@app.route('/api/GetCouresName',methods=['POST']) 
def GetCouresName():
    course = request.get_json()
    courseName = course['name']
    print("drumroll please...")
    print(courseName)
    return courseName,201

@app.route('/api/test')
def get_current_time():
        return {"BEEAN":"BEAN FOR THE BEAN GOD"}

if __name__ == "__main__":
   app.run(debug=True)

