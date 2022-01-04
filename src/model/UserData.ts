export class UserData{
    name : string;
    id : string;
    roomID : string
    themeColor : string = "red"
    public constructor(init?: Partial<UserData>) {
        Object.assign(this, init);
    }
}