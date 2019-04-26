/**
 * @module utils
 */

/**
 * Given an enum and a value from the enum, returns the associated key.
 *
 * @param enumObj Enum
 * @param enumValue Value from the given enum
 */
export function getEnumKeyByValue(enumObj: any, enumValue: any): string|undefined {
    const keys = Object.keys(enumObj).filter((key) => enumObj[key] === enumValue);
    return keys.length > 0 ? keys[0] : undefined;
}
