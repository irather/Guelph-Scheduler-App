# Sprint 3

## Team Members:
Brandon Tu(1047332), Affan Khan (1095729), Himmat Mahal (1094444), Chris Fitzgerald (1099497), Mussab Bin Imran (1111908) and Ibrahim Rather (1097660)


## How to run
 1. Open up the 'scheduler.xlsm'
 ![program_ss
 ](/uploads/d929fc32cfae0ce1fb9e87d4bf39906c/program_ss.png)

 2. if the Courses sheet is not already populated, populate it by:
    - going into the parser directory, running courseParser.py, and then running the courseImport macro (go to View > View Macros)
    - make sure the Courses sheet is completely empty before doing this

 3. Insert the course code(including the section number) for the desired course into the green box (ex ACCT* 1220 * 0101) ignore the spaces. Press 'Submit' button and then the course will be displayed on the scheduler 
 ![entering-courses
 ](/uploads/2fa890946cd5736aec9388e09be5053e/entering-courses.png)

  4. Enter in any desired time preferences and days preferred off for suggested courses and press 'Suggest Courses' button. Suggested courses will be then displayed into the schedule and a table below the preferences settings. Default course preferences are set to be early morning (8am-12pm).
![enter-preferences
](/uploads/efdea2d3859bf76f96e3a3650026d2a8/enter-preferences.png)

  5. Click 'Clear Suggested Courses' to remove suggested courses from the schedule. Click 'Clear' to remove all courses added and suggested.
  ![clear-suggested
  ](/uploads/28266ab92230083920e420c2553e9c25/clear-suggested.png)




## Files Included (UPDATE FOR SPRINT 3)
- scheduler.xlsm
- VBA_notes, folder contains VBA notes taken while researching/working on it
- sample.csv, CSV file contain the sample format for the courses section
- parser folder, containing the sprint 1 python program modified to return a CSV format instead

## Git Usage
- To calculate the weight for a specific assignee, go to the boards tab and using the search bar, 
  search for the assignee you wish to total the weight for along with the milestone (the sprint). 
  After seaching, add the weights from the open issues to the closed issues to find the total
  assigned weight to a person for the sprint.
- Each sprint branch should be branched off of main
- Each time a new issue is created make sure it has the appropriate sprint associated with it
  as a milestone
- create branches based on issue number as 'issue-#' where '#' is the issue number. After the
  issue is complete, merge it with the correct sprint branch. NEVER MERGE TO MAIN.
