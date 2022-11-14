const functions = require("./functions")

alert = jest.fn();

//convertTime tests
test('changes the 1:00PM to 13:00:00', () => {
  expect(functions.convertTime("1:00", "PM")).toBe("13:00:00");
});

test('changes the 1:00PM to 1:00:00', () => {
  expect(functions.convertTime("1:00", "AM")).toBe("01:00:00");
});

//throwAlert tests
schedulerData = [
  {
    startDate: "10:00:00",
    endDate: "11:00:00",
    title: "dummy course 1"
  },
  {
    startDate: "14:00:00",
    endDate: "15:00:00",
    title: "dummy course 2"
  },
]

checkCourse1 = {
  startDate: "14:00:00",
  endDate: "15:00:00",
  title: "check course 1"
}

checkCourse2 = {
  startDate: "11:00:01",
  endDate: "13:59:59",
  title: "check course 2"
}

checkCourse3 = {
  startDate: "9:00:00",
  endDate: "12:00:00",
  title: "check course 3"
}

checkCourse4 = {
  startDate: "14:00:01",
  endDate: "14:30:00",
  title: "check course 3"
}

test('There should be a conflict between check course 1 and dummy course 1', () => {
  expect(functions.throwAlert(schedulerData, checkCourse1)).toBe(true);
});

test('There should NOT be a conflict between check course 2 the schedulerData', () => {
  expect(functions.throwAlert(schedulerData, checkCourse2)).toBe(false);
});

test('There should be a conflict between check course 3 the schedulerData', () => {
  expect(functions.throwAlert(schedulerData, checkCourse3)).toBe(true);
});

test('There should be a conflict between check course 4 the schedulerData', () => {
  expect(functions.throwAlert(schedulerData, checkCourse4)).toBe(true);
});
