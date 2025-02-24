import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from 'app/core/user/user.types';
import { LocalStorageService } from 'app/services/local-storage.service';
import { BehaviorSubject, map, Observable, of, ReplaySubject, tap } from 'rxjs';

@Injectable({providedIn: 'root'})
export class UserService
{
    private _user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

    constructor(
        private _httpClient: HttpClient,
        private _localStorageService: LocalStorageService
    ) {}

    set user(value: User) {
        // Store the value
        this._user.next(value);
    }

    get user$(): Observable<User | null> {
        return this._user.asObservable();
    }

    get(): Observable<User | null> {
        const user = this._localStorageService.getUser();
        return of(user).pipe(
            tap((user) => {
                this._user.next(user);
            }),
        );
    }
    /**
     * Update the user
     *
     * @param user
     */
    update(user: User): Observable<any>
    {
        return this._httpClient.patch<User>('api/common/user', {user}).pipe(
            map((response) =>
            {
                this._user.next(response);
            }),
        );
    }
}
