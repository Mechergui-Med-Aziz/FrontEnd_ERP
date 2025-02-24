import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { FuseLoadingService } from '@fuse/services/loading/loading.service';
import { finalize, Observable, take } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
export const fuseLoadingInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> =>
{
    const fuseLoadingService = inject(FuseLoadingService);
    let handleRequestsAutomatically = false;
    const   spinner= inject(NgxSpinnerService)

    fuseLoadingService.auto$
        .pipe(take(1))
        .subscribe((value) =>
        {
            handleRequestsAutomatically = value;
        });

    // If the Auto mode is turned off, do nothing
    if ( !handleRequestsAutomatically )
    {
        return next(req);
    }

    // Set the loading status to true
    fuseLoadingService._setLoadingStatus(true, req.url);
    spinner.show('principalSpinner');

    return next(req).pipe(
        finalize(() =>
            {
                // Set the status to false if there are any errors or the request is completed
                fuseLoadingService._setLoadingStatus(false, req.url);
                spinner.hide('principalSpinner');
        }));
};
