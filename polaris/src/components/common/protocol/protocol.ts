// 用以表示模型数据的可见性状态，对应各个数据库表中的status字段
// 从初始状态0，到最终已发布状态1之间要经历机审、社区管理员审核、频道管理员审核三个阶段
// 对于特殊的数据类型可以跳过一些阶段直接变成已发布状态
export enum PSDataStatus {
    New = 0, // 新创建未审核的状态
    Published = 1, // 已经经过社区和管理员审核状态，可以公开被其它用户看到
    MachineApproved = 2, // 机器审核通过状态
    MachineRejected = 21, // 机器审核拒绝状态
    ManagerApproved = 3, // 社区管理员已审核通过状态
    ManagerRejected = 31,   // 社区管理员已拒绝状态
    ChannelApproved = 4, // 频道管理员已核通过状态
    ChannelRejected = 41, // 频道管理员已拒绝状态
    Blocked = 5 // 被封禁状态不公开显示
}
