/** Copyright 2022 NEC Corporation
Released under the MIT license.
https://opensource.org/licenses/mit-license.php
*/
/**
 *
 *
 *
 * $Date$
 * $Revision$
 * $Author$
 *
 * TEMPLATE VERSION :  76463
 */

import { Type } from 'class-transformer';

class EstablishAt {
    start: Date;

    end: Date;
}

export default class PostUserListReqDto {
    /** userId */
    userId: string[];

    /** establishAt */
    @Type(() => EstablishAt)
    establishAt: EstablishAt;

    includeRequest: boolean = false;
}
