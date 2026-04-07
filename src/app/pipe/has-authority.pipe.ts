import { Pipe, PipeTransform } from '@angular/core';
import {AuthService} from "../services/auth.service";

@Pipe({
  name: 'hasAuthority',
  standalone: true
})
export class HasAuthorityPipe implements PipeTransform {

  constructor(private as: AuthService) {}

  transform(value: string[]): boolean {
    return value.findIndex(authority => this.as.hasAuthority(authority)) !== -1;
  }

}
