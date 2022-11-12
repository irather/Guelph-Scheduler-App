const convertTime = require("./convertTime")
//const test = require("./test")

test('changes the given time to 24 hour time', () => {
    expect(convertTime.convertTime("1:00", "PM")).toBe("13:00:00");
  });

  test('test function', () => {
    expect(convertTime.testing()).toBe(1);
  });