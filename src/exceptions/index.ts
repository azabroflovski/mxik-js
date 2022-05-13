/**
 * Handle MXIK unknown exceptions
 */
export class MXIKUnknownException extends Error {
    constructor(message: any) {
        super(message)
        this.name = 'NotFoundException'
    }
}