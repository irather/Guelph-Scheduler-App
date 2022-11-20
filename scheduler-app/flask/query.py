import json
from unicodedata import name

class Parser:
    def findCourse(self, courseName, sem):
        file = open('./parser/parsed.json')

        data = json.load(file)

        for i in data['all']:
            if courseName.lower() in i['name'].lower() and sem == i["term"]:
                return(i)
        else:
            print("not found")

        return("")

    def find10Courses(self, courseName, sem):
        file = open('./parser/parsed.json')

        data = json.load(file)
        results = []

        for i in data['all']:
            if courseName.lower() in i['name'].lower() and sem == i["term"]:
                results.append(i)
            if(len(results) == 10):
                break

        return(results)

    def findAllCourses(self, courseName, sem):
        file = open('./parser/parsed.json')

        data = json.load(file)
        results = []

        for i in data['all']:
            if courseName.lower() in i['name'].lower() and sem == i["term"]:
                results.append(i)

        return(results)