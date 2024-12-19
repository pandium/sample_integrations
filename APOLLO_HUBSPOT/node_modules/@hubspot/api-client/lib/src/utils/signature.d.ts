import { ISignatureOptions } from './ISignatureOptions';
export declare class Signature {
    static readonly MAX_ALLOWED_TIMESTAMP = 300000;
    static isValid({ method, signatureVersion, ...options }: ISignatureOptions): boolean;
    static getSignature(method: string, signatureVersion: string, options: ISignatureOptions): string;
}
