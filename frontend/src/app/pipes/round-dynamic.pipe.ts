import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "roundDynamic"
})
export class RoundDynamicPipe implements PipeTransform {
  transform(value: number): number {
    if (value > 30 && value <= 99) {
      return Math.round(value / 5) * 5;
    }

    if (value >= 100 && value <= 199) {
      return Math.round(value / 10) * 10;
    }

    if (value >= 200 && value <= 999) {
      return Math.round(value / 50) * 50;
    }

    if (value >= 999 && value <= 9999) {
      return Math.round(value / 100) * 100;
    }

    if (value >= 10000) {
      return Math.round(value / 1000) * 1000;
    }

    return value;
  }
}
