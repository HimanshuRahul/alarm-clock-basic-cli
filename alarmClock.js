class Alarm {
  constructor(time, dayOfWeek) {
    this.time = new Date(time);
    this.dayOfWeek = dayOfWeek;
    this.snoozeCount = 0;
    this.active = true;
  }

  snooze() {
    if (this.snoozeCount < 3) {
      this.time.setMinutes(this.time.getMinutes() + 5);
      this.snoozeCount += 1;
      console.log("Alarm snoozed to", this.time);
    } else {
      console.log("Maximum snooze limit reached.");
    }
  }

  delete() {
    this.active = false;
    console.log("Alarm deleted.");
  }
}

class AlarmClock {
  constructor() {
    this.alarms = [];
    this.daysOfWeek = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
  }

  displayCurrentTime() {
    console.log("Current time:", new Date());
  }

  getNextAlarmDate(time, dayOfWeek) {
    const now = new Date();
    const dayIndex = this.daysOfWeek.indexOf(dayOfWeek.toLowerCase());
    if (dayIndex === -1) {
      throw new Error("Invalid day of the week.");
    }

    let alarmDate = new Date(time);
    if (isNaN(alarmDate.getTime())) {
      throw new Error(
        "Invalid date format. Please enter the date in the correct format."
      );
    }

    const currentDayIndex = now.getDay();

    if (
      alarmDate < now ||
      currentDayIndex > dayIndex ||
      (currentDayIndex === dayIndex && alarmDate.getTime() < now.getTime())
    ) {
      throw new Error(
        "The selected time is invalid. Alarm time cannot be less than the current time."
      );
    }

    if (currentDayIndex < dayIndex) {
      alarmDate.setDate(now.getDate() + (dayIndex - currentDayIndex));
    }

    return { alarmDate, dayOfWeek: this.daysOfWeek[dayIndex] };
  }

  createAlarm(time, dayOfWeek) {
    try {
      const { alarmDate, dayOfWeek: formattedDayOfWeek } =
        this.getNextAlarmDate(time, dayOfWeek);
      let alarm = new Alarm(alarmDate, formattedDayOfWeek);
      this.alarms.push(alarm);
      console.log("Alarm set for", alarm.time, "on", alarm.dayOfWeek);
    } catch (error) {
      console.log(error.message);
    }
  }

  deleteAlarm(index) {
    if (this.alarms[index]) {
      this.alarms[index].delete();
      this.alarms.splice(index, 1);
    } else {
      console.log("Alarm not found.");
    }
  }

  snoozeAlarm(index) {
    if (this.alarms[index]) {
      this.alarms[index].snooze();
    } else {
      console.log("Alarm not found.");
    }
  }

  checkAlarms() {
    const now = new Date();
    this.alarms.forEach((alarm, index) => {
      if (alarm.active && now >= alarm.time) {
        console.log(`\nAlarm ${index + 1} ringing! Time: ${alarm.time}`);
        this.deleteAlarm(index);
      }
    });
  }
}

const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let alarmClock = new AlarmClock();

function showMenu() {
  console.log("\n1. Display Current Time");
  console.log("2. Set Alarm");
  console.log("3. Snooze Alarm");
  console.log("4. Delete Alarm");
  console.log("5. Exit");
}

function main() {
  showMenu();
  rl.question("Choose an option: ", (option) => {
    switch (option) {
      case "1":
        alarmClock.displayCurrentTime();
        main();
        break;
      case "2":
        rl.question("Enter alarm time (YYYY-MM-DD HH:MM:SS): ", (time) => {
          rl.question("Enter day of the week: ", (day) => {
            alarmClock.createAlarm(time, day);
            main();
          });
        });
        break;
      case "3":
        rl.question("Enter alarm index to snooze: ", (index) => {
          alarmClock.snoozeAlarm(index - 1);
          main();
        });
        break;
      case "4":
        rl.question("Enter alarm index to delete: ", (index) => {
          alarmClock.deleteAlarm(index - 1);
          main();
        });
        break;
      case "5":
        console.log("You exited from the app.");
        rl.close();
        break;
      default:
        console.log("Invalid option. Try again.");
        main();
    }
  });
}

setInterval(() => {
  alarmClock.checkAlarms();
}, 1000);

main();
