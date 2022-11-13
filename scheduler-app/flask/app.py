"""
    app.py
        - Flask app for course scheduler
    Authors: CIS3760 F22 Team 302
"""
from flask import Flask, request
from query import Parser


app = Flask(__name__, static_folder='../build', static_url_path='/')


@app.route('/api/profile')
def my_profile():
    """
    Example endpoint
    """
    response_body = {
        "name": "Brandon",
        "about": "God I hope this works"
    }

    return response_body


@app.route('/api/response_1')
def response_1():
    """
    Example endpoint 2
    """
    response_body = {
        "header": "Scheduler",
        "body": "This week's schedule"
    }

    return response_body


@app.route('/api/getCourseList')
def get_course_list():
    """
    Example endpoint for course list
    """
    response_body = {
        "list": ["ACCT*1220*0101", "CIS*3760*0101"]
    }
    return response_body

# @app.route('/api/course/<course>/section/<section>')
# def courses(course, section):
#     """
#     Example endpoint for course details
#     """
#     response_body = {
#         "course_name_section": "ACCT*1220*0101",
#         "meetings": {
#             "SEM": "Mon 04:30PM - 05:20PM MCKN, Room 225",
#             "LEC": "Fri 08:30AM - 10:20AM, Room 104",
#             "LAB": "",
#             "EXAM": "Tues 08:30AM - 10:30AM (2022/12/06) Room TBA"
#         }
#     }
#     return response_body


@app.route('/api/searchCourse', methods=['POST'])
def search_course():
    """
    - function that obtains the course name the name 
      can be changed to a more fitting name
    """
    course = request.get_json()
    course_name = course['name']

    parser = Parser()
    searched_courses = parser.findCourse(course_name)
    print(searched_courses)

    return searched_courses, 201


@app.route('/api/search10Courses', methods=['POST'])
def search_10_courses():
    """
    - function that gets a list of the first 10 courses that has the given text
    """
    course = request.get_json()
    course_name = course['name']

    parser = Parser()
    searched_courses = parser.find10Courses(course_name)
    print(searched_courses)

    return searched_courses, 201


@app.route('/api/searchAllCourses', methods=['POST'])
def search_all_courses():
    """
    - function that gets a list of the courses that has the given text
    """
    course = request.get_json()
    course_name = course['name']

    parser = Parser()
    searched_courses = parser.findAllCourses(course_name)

    return searched_courses, 201


@app.route('/api/test')
def get_current_time():
    """
    Test endpoint
    """
    return {"BEEAN": "BEAN FOR THE BEAN GOD"}


if __name__ == "__main__":
    app.run(debug=True)
