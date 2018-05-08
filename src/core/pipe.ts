import { Pipe, PipeTransform } from '@angular/core';
import { Observable } from 'rxjs/Rx';
import { isPrimitive, isString } from './'

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {
  transform <T> (value: Observable<T[]> | T[], 
    kwargs?: string | string [], 
    args?: string | string[] | any | any[]): Observable<T[]> | T[] {
    return (args && kwargs)
    ? (value instanceof Observable)
    ? value.map((x: T[]) => this.filterArray(x, kwargs, args))
    : this.filterArray(x, kwargs, args)
    : value;
  }

  private filterArray <T> (arr: T[], kwargs?: string | string [], 
    args?: string | string[] | any | any[]): T[] {
    return arr.filter(x => {
      let _keys = kwargs
      return (Array.isArray(_keys) && Array.isArray(args))
      ? this.anyEqual(x, <string[]>_keys, args)
      : (!Array.isArray(_keys) && Array.isArray(args))
      ? this.areEqual(x, <string>_keys, args)
      : (!Array.isArray(args) && Array.isArray(_keys))
      ? this.otherEqual(x, <string[]>_keys, args)
      : this.isEqual(x, <string>_keys, args)
    })
  }

  private otherEqual <T> (obj: T, keys: string[], args: string | any, soFar?: boolean = false): boolean {
    if (keys.length == 0)
      return soFar
    let _curn = keys.pop()
    return this.otherEqual(obj, keys, args, (soFar || this.isEqual(obj, _curn, args)))
  }

  private anyEqual <T> (obj: T, keys: string[], args: string[] | any[], soFar?: boolean = false): boolean {
    if (keys.length == 0)
      return soFar
    let _curn = keys.pop()
    return this.anyEqual(obj, keys, args, (soFar || this.areEqual(obj, _curn, args)))
  }

  private areEqual <T> (obj: T, key: string, args: string[] | any[]): boolean {
    return (obj[key] && isString(obj[key])
      ? JSON.stringify(args).toLowerCase().includes((<string> obj[key]).toLowerCase())
      : JSON.stringify(args).toLowerCase().includes(JSON.stringify(obj[key]).toLowerCase()))
  }

  private isEqual <T> (obj: T, key: string, args: string | any): boolean {
    return (obj[key] && (isPrimitive(args))? obj[key] == args: JSON.stringify(obj[key]).toLowerCase().includes(JSON.stringify(args).toLowerCase()))
  }
}
