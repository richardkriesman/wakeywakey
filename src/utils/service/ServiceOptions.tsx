/**
 * @module utils
 */

import {ServiceStaticBase} from "./Service";

/**
 * A string name that uniquely identifies the {@link Service}.
 *
 * This must be set so that AppDatabase.getService() can resolve the service. This is because when built in
 * production mode, class names are minimized and may not be what we expect them to be.
 */
export function ServiceName(name: string) {
    return function <T>(constructor: T) {
        ((constructor as unknown) as ServiceStaticBase).SERVICE_NAME = name;
    };
}
