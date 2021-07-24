import { NgModule } from '@angular/core';

import { SafeHtmlPipe } from './safe-html.pipe';
import { HtmlToPlaintextPipe } from './html-to-text.pipe';
import { Html2PlaintextPipe } from './htmlToPlaintext.pipe';
import { UtctToLocalPipe } from './utcToLocal.pipe';

@NgModule({
    declarations: [
        HtmlToPlaintextPipe,
        Html2PlaintextPipe,
        SafeHtmlPipe,
        UtctToLocalPipe
    ],
    imports: [],
    exports: [
        HtmlToPlaintextPipe,
        Html2PlaintextPipe,
        SafeHtmlPipe,
        UtctToLocalPipe
    ]
})
export class EhPipesModule { }

