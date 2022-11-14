import json
from unicodedata import name

class Parser:
    def findCourse(self, courseName):
        file = open('./parser/parsed.json')

        data = json.load(file)

        for i in data['all']:
            if courseName.lower() in i['name'].lower():
                return(i)
        else:
            print("not found")

        return("")

    def find10Courses(self, courseName):
        file = open('./parser/parsed.json')

        data = json.load(file)
        results = []

        for i in data['all']:
            if courseName.lower() in i['name'].lower():
                results.append(i)
            if(len(results) == 10):
                break

        return(results)

    def findAllCourses(self, courseName):
        file = open('./parser/parsed.json')

        data = json.load(file)
        results = []

        for i in data['all']:
            if courseName.lower() in i['name'].lower():
                results.append(i)

        return(results)