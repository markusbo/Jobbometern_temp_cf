import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "roundDynamicUnit"
})
export class RoundDynamicUnitPipe implements PipeTransform {
  transform(value: number): string {

    if (value < 1000) {
      return value.toString();
    }
    
    if (value > 999 && value <= 1e6) {
      return (+(1.0 * value / 1000).toFixed(1)).toString() + 'K';//(Math.round(value / 100) / 10).toString() + ' K';
    }

    if (value > 1e6) {
      return (+(1.0 * value / 1e6).toFixed(1)).toString() + 'M';
    }
  }
}
