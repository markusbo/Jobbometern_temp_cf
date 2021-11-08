import { Pipe, PipeTransform } from "@angular/core";
import { ifError } from "assert";

@Pipe({
  name: "cleanUpUrl"
})
export class CleanUpUrlPipe implements PipeTransform {
  transform(url: any): string {
    if (typeof url !== "undefined" || url === "") {
      let replacedUrl = url.replace("https://", "").replace("http://", "");

      if (replacedUrl.substring(0, 4) !== "www.") {
        replacedUrl = "www." + replacedUrl;
      }
      return replacedUrl;
    } else return url;
  }
}
