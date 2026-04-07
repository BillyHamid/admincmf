import {Directive, ElementRef, Input, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";

@Directive({
  selector: '[appHasAuthority]',
  standalone: true
})
export class HasAuthorityDirective implements OnInit{

  @Input("appHasAuthority") options: string[] = [];

  constructor(private elementRef: ElementRef, private auth: AuthService) {}

  ngOnInit() {

    this.checkAccess();

  }

  private checkAccess() {

    let i = this.options.findIndex(authority => this.auth.hasAuthority(authority));
    if (i === -1 ){
      this.elementRef.nativeElement.style.display = "none";
    }


  }
}
