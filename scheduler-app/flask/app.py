from urllib import response
from flask import Flask, render_template


app = Flask(__name__,static_folder='../build',static_url_path='/')

@app.route('/api/profile')
def my_profile():
    response_body = {
        "name": "Brandon",
        "about" :"God I hope this works"
    }

    return response_body


@app.route('/api/response_1')
def response_1():
    response_body = {
        "header": "Scheduler",
        "body" :"This week's schedule"
    }

    return response_body

@app.route('api/getCourseList')
def getCourseList():
    response_body = ["ACCT*1220", "CIS*3760"]
    return response_body

@app.route('api/course/<course>/section/<section>')
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

@app.route('/api/test')
def get_current_time():
        return {"BEEAN":"BEAN FOR THE BEAN GOD"}

#if __name__ == "__main__":
#    app.run(debug=True)

