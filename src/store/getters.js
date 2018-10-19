const getters = {
    getfuwindex_on: state => state.service.fuwindex_on,
    token: state => state.login.token,
    noticeNumber: state => state.login.noticeNumber,
    userInfoObj: state => state.login.userInfoObj,
    rightInfoObj: state => state.login.rightInfoObj,
    isOut: state => state.login.isOut,
    isDone: state => state.permission.isDone,
    permission_routers: state => state.permission.routers,
    addRouters: state => state.permission.addRouters,
};
export default getters