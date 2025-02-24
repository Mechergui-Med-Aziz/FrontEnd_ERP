import { Injectable } from "@angular/core";
import Base64 from "crypto-js/enc-base64";
import Utf8 from "crypto-js/enc-utf8";

@Injectable({
  providedIn: 'root',
})
export class Base64Service {
  encode(input: string): string {
    const wordArray = Utf8.parse(input);
    return Base64.stringify(wordArray);
  }

  decode(input: string): string {
    const wordArray = Base64.parse(input);
    return Utf8.stringify(wordArray);
  }
}