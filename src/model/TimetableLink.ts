export class TimetableLink {
    id: string;
    loaded: boolean;
    url: string;
    owerID: string;
    name: string;
    public constructor(init?: Partial<TimetableLink>) {
        Object.assign(this, init);
    }
}