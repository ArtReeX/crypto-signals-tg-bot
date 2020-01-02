import moment, { Moment } from "moment";
import { Interval } from "./config";
import { intervalInMinutes } from "./utilities";

interface ITimes {
  [key: string]: Moment;
}

export default class Eventer {
  timers: ITimes = {};

  public add = (direction: string) => {
    this.timers[direction] = moment().add(
      intervalInMinutes(direction.split("/")[1] as Interval),
      "minutes"
    );
  };

  public isAllowed = (direction: string) => {
    return this.timers[direction]
      ? moment().isAfter(this.timers[direction])
      : true;
  };
}
