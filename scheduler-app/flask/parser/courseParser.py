# parser code goes here

import collections, json, sys, csv
from html.parser import HTMLParser

class GuelphCourseParser(HTMLParser):
    """
    HTMLParser scans through an html file and has hooks for running code when
    encountering the start of a tag, end of a tag, and data within a tag

    - this is not as sophisticated as an HTML DOM which makes it very easy to
      parse html, but it gets the job done.
    """

    def __init__(self):
        HTMLParser.__init__(self)
        """
        Lists will store the data in a 'table' like format
        where an index corresponds to a row.
        """
        # table entries
        self.terms = []
        self.statuses = []
        self.codes = []
        self.names = []
        self.locations = []
        self.meets = [] # [ {sem: "ssasad", lab: "asad"}, ... ]
        self.faculty = []
        self.credits = []
        self.academic = []
        self.avail = []

        # these are useful when getting data nested in tags
        self.termTagFound = False
        self.openTagFound = False
        self.codeAndNameTagFound = False
        self.locationFound = False

    def handle_starttag(self, tag, attrs):
        """
        Handles what happens when the start of a tag is encountered.
        - e.g. if we know the term (e.g. Fall 2022) is stored in a tag with id
               suffixed with "WSS_COURSE_SECTIONS_" we know the next paragraph
               tag will have the data "Fall 2022" stored. So we set the 
               self.termTagFound" on.
        - some tags are single self-closing tags, this also handles those
        """
        attrs = {k: v for k, v in attrs} # fast searching

        if tag == "p" and ("id" in attrs and attrs["id"][:20] == "WSS_COURSE_SECTIONS_"):
            self.termTagFound = True
        elif tag == "p" and ("id" in attrs and attrs["id"][:9] == "LIST_VAR1"):
            self.openTagFound = True
        elif tag == "a" and ("id" in attrs and attrs["id"][:16] == "SEC_SHORT_TITLE_"):
            self.codeAndNameTagFound = True
        elif tag == "p" and ("id" in attrs and attrs["id"][:13] == "SEC_LOCATION_"):
            self.locationFound = True
        elif tag == "input" and ("name" in attrs and attrs["name"][:17] == "SEC.MEETING.INFO_" and attrs["name"][17:] != "MAX"):
            ## find the type of meeting, and store it as "type": ["time"]
            meetings = attrs["value"].split("\n")
            meetingsDict = collections.defaultdict(list)
            for meeting in meetings:
                if len(meeting) < 25:
                    continue
                elif meeting[22:25] == "LEC":
                    meetingsDict["lec"].append(meeting[26:])
                elif meeting[22:25] == "LAB":
                    meetingsDict["lab"].append(meeting[26:])
                elif meeting[22:25] == "SEM":
                    meetingsDict["sem"].append(meeting[26:])
                elif meeting[22:26] == "EXAM":
                    meetingsDict["exam"].append(meeting[27:])
                elif meeting[22:40] == "Distance Education":
                    meetingsDict["distance_education"].append(meeting[41:])
                elif meeting[22:32] == "Electronic":
                    meetingsDict["electronic"].append(meeting[33:]) 
                else:
                    meetingsDict["Other"].append(meeting[22:])
            self.meets.append(meetingsDict)
        elif tag == "input" and ("name" in attrs and attrs["name"][:17] == "SEC.FACULTY.INFO_" and attrs["name"][17:] != "MAX"):
            self.faculty.append(attrs["value"])
        elif tag == "input" and ("name" in attrs and attrs["name"][:13] == "SEC.MIN.CRED_" and attrs["name"][13:] != "MAX"):
            self.credits.append(attrs["value"])
        elif tag == "input" and ("name" in attrs and attrs["name"][:15] == "SEC.ACAD.LEVEL_" and attrs["name"][15:] != "MAX"):
            self.academic.append(attrs["value"])
        elif tag == "input" and ("name" in attrs and attrs["name"][:10] == "LIST.VAR5_" and attrs["name"][10:] != "MAX"):
            self.avail.append(f'\'{attrs["value"]}') # prevent excel from auto-formatting this to a date

    def handle_endtag(self, tag):
        """
        Handles what happens when a closing tag is found.
        """
        if tag == "p" and self.termTagFound:
            self.termTagFound = False
        elif tag == "p" and self.openTagFound:
            self.openTagFound = False
        elif tag == "a" and self.codeAndNameTagFound:
            self.codeAndNameTagFound = False
        elif tag == "p" and self.locationFound:
            self.locationFound = False

    def handle_data(self, data):
        """
        Handles what happens when the data within a tag is found.
        - e.g. if we know from previous tags, that the next data contains the Term,
               we will append to the list of terms
        """
        if self.termTagFound:
            self.terms.append(data)
        elif self.openTagFound:
            self.statuses.append(data)
        elif self.codeAndNameTagFound:
            courseCode = data[:data.index("*", 5)] 
            # - only course codes e.g. ACCT*1200
            self.codes.append(courseCode)
            self.names.append(data)
        elif self.locationFound:
            self.locations.append(data)

def parseToCSV(filename):
    prsr = GuelphCourseParser()
    with open("./Section Selection Results WebAdvisor University of Guelph.html") as f:
        prsr.feed(f.read())

    with open('parsed.csv', 'w', newline='') as csvfile:
        courseWriter = csv.writer(
            csvfile, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL
        )
        courseWriter.writerow(
            "Term,Status,Code,Section Name and Title,Location,Faculty,Available/"\
            "Capacity,Credits,Academic Level,SEM,LEC,LAB,EXAM,Other Meetings".split(",")
        )
        for row in zip(
            prsr.terms, prsr.statuses, prsr.names, prsr.locations, prsr.faculty, 
            prsr.avail, prsr.credits, prsr.academic, prsr.meets
        ):
            row = list(row)
            meets = row.pop()
            row.extend([*meets["sem"], *meets["lec"], *meets["lab"], *meets["exam"], *meets["Other"]])
            row.insert(2, row[2][:row[2].index("(") - 1])
            courseWriter.writerow(row)

def parseToJsonTimeFriendly(filename):
    prsr = GuelphCourseParser()
    with open("./Section Selection Results WebAdvisor University of Guelph.html") as f:
        prsr.feed(f.read())

    all = []
    for row in zip(
            prsr.terms, prsr.statuses, prsr.names, prsr.locations, prsr.faculty, 
            prsr.avail, prsr.credits, prsr.academic, prsr.meets
        ):
        new = {}
        new["term"] = row[0]
        new["status"] = row[1]
        new["name"] = row[2]
        new["location"] = row[3]
        new["faculty"] = row[4]
        new["capacity"] = row[5] # may not be needed
        new["credits"] = row[6]
        new["academic_level"] = row[7]

        meets = row[-1]
        meetings = [*meets["sem"], *meets["lec"], *meets["lab"], *meets["exam"], *meets["Other"]]

        allTBA = lambda x: ":" not in x
        getDays = lambda x: x[:x.index(":")-2]
        getStartTime = lambda x: x[x.index(":")-2:x.index(":")+3]
        getStartTimeType = lambda x: x[x.index(":")+3: x.index(":")+5]
        getEndTime = lambda x: x[x.index("-")+2:x.index("-")+7]
        getEndTimeType = lambda x: x[x.index("-")+7:x.index("-")+9]
        getLoc = lambda x: x[x.index("-")+9:]
        
        new["meeting_info"] = {
            "SEM": {},
            "LEC": {},
            "LAB": {},
            "EXAM": {}
        }
        for type, meet in zip(new["meeting_info"], meetings):
            if allTBA(meet):
                continue
            new["meeting_info"][type]["days"] = getDays(meet)
            new["meeting_info"][type]["start_time"] = getStartTime(meet)
            new["meeting_info"][type]["start_type"] = getStartTimeType(meet)
            new["meeting_info"][type]["end_time"] = getEndTime(meet)
            new["meeting_info"][type]["end_type"] = getEndTimeType(meet)
            new["meeting_info"][type]["location"] = getLoc(meet)
        all.append(new)
    json.dump({"all": all}, open(filename, "w"), indent=4)

def parseToJsonFile(filename):
    """
    - Extracts the data from the lists created by the GuelpCourseParser,
      and inserts them into a JSON as formatted by example.json
    """
    parser = GuelphCourseParser()
    with open("./Section Selection Results WebAdvisor University of Guelph.html") as f:
        parser.feed(f.read())

    courseDict = {}
    for term, code, name, location, meetings, instructors, credit, level in zip(
                    parser.terms, parser.codes, parser.names, 
                    parser.locations, parser.meets, parser.faculty, 
                    parser.credits, parser.academic):
        ## gets a row of info, similar to how it looks on the web page

        if code not in courseDict:
            courseDict[code] = {
                "term": term,
                "location": location,
                "names": name,
                "faculty": instructors,
                "credits": credit,
                "academic_level": level
            }

        # there are multiple meetings per course, some overlap,
        #  this adds non-duplicate meetings to the list of meetings
        for k, v in meetings.items():
            if k not in courseDict[code]:
                courseDict[code][k] = v
            else:
                for vv in v:
                    if vv not in courseDict[code][k]:
                        courseDict[code][k].append(vv)
    res = []
    for k, v in courseDict.items():
        res.append(v)
        res[-1]["code"] = k
    json.dump(res, open(filename, "w"), indent=4)

# Run the parser
parseToJsonTimeFriendly("parsed.json")
