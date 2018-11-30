let getters = {
    getfuwindex_on: state => state.service.getfuwindex_on,
    token: state => state.login.token,
    noticeNumber: state => state.login.noticeNumber,
    sysEchartsActIndex: state => state.service.sysEchartsActIndex,
    userInfoObj: state => state.login.userInfoObj,
    rightInfoObj: state => state.login.rightInfoObj,
    isOut: state => state.login.isOut,
    activePath: state => state.login.activePath,
    isDone: state => state.permission.isDone,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
    servTagArr: state => state.service.servTagArr,
    getServiceComponentName: state => state.service.compName,
    formLeave: state => state.service.formLeave,
};
export default getters