export class UrlHelper{
    getParamsStr = (url : string) => {
        return url.split("?")[1];
    }
    getModulesStr = (params : string) => {
        return params.split("&");
    }
    getModule = (module : string) => {
        return module.split("=");
    }
    getRooms = (rooms : string) => {
        return rooms.split(",");
    }
    getClasseId = (myclass : string) => {
        return myclass.split(":");
    }


}