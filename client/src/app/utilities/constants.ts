export class Constants {
    public static readonly END_POINT: string = 'http://localhost:3000/';

    public static readonly GET_DB_JOURNAL: string = this.END_POINT + 'DataBaseJournal/getEvents';

    public static readonly CREATE_USER: string = this.END_POINT + 'users/createUser';
    public static readonly AUTHORIZE: string = this.END_POINT + 'users/authorize';

    public static readonly CREATE_PROJECT: string = this.END_POINT + 'projectManagerMenu/createProject';
    public static readonly GET_PROJECTS_FOR_PM: string = this.END_POINT + 'projectManagerMenu/getProjects';
    public static readonly SAVE_PROJECTS: string = this.END_POINT + 'projectManagerMenu/saveProjects';
    public static readonly GET_EMPLOYEES_ON_PROJECT: string = this.END_POINT + 'projectManagerMenu/getEmployeesOnProject';
    public static readonly GET_EMPLOYEES_TO_SELECT: string = this.END_POINT + 'projectManagerMenu/getEmployeesToSelect';
    public static readonly CREATE_PROJECT_EMPLOYEE_RELATION: string = this.END_POINT + 'projectManagerMenu/createProjectEmployeeRelation';
    public static readonly REMOVE_PROJECT_EMPLOYEE_RELATION: string = this.END_POINT + 'projectManagerMenu/removeProjectEmployeeRelation';

    public static readonly GET_USERS_AND_ROLES: string = this.END_POINT + 'adminMenu/getUsersAndRoles';
    public static readonly FIND_USERS_AND_ROLES: string = this.END_POINT + 'adminMenu/findUsersAndRoles';
    public static readonly GET_USER_ROLES: string = this.END_POINT + 'adminMenu/getUserRoles';
    public static readonly GET_USER_REQUESTS: string = this.END_POINT + 'adminMenu/getUserRequests';
    public static readonly SET_USER_ROLE: string = this.END_POINT + 'adminMenu/setUserRole';
    public static readonly DECELINE_REQUEST: string = this.END_POINT + 'adminMenu/decelineRequest';
    public static readonly GET_TABLES_INFORMATION: string = this.END_POINT + 'adminMenu/getDatabaseTablesInformation';
    public static readonly GET_CUSTOM_SQL_QUERY_RESULT: string = this.END_POINT + 'adminMenu/getCustomSqlQueryResult';
    public static readonly EXPORT_SQL_QUERY_RESULT: string = this.END_POINT + 'adminMenu/exportSqlQueryResult';
    public static readonly CREATE_DATABASE_BACKUP: string = this.END_POINT + 'adminMenu/createDataBaseBackup';
    public static readonly GET_DATABASE_BACKUPS: string = this.END_POINT + 'adminMenu/getDataBaseBackups';
    public static readonly DOWNLOAD_DATABASE_BACKUPS: string = this.END_POINT + 'adminMenu/downloadDatabaseBackupFile';

    public static readonly GET_COLUMNS_CONFIG: string = this.END_POINT + 'board/getColumnsConfig';
    public static readonly GET_TASKS: string = this.END_POINT + 'board/getTasks';
    public static readonly UPDATE_TASK_COLUMN_INDEX: string = this.END_POINT + 'board/updateTaskColumnIndex';
    public static readonly CREATE_TASK: string = this.END_POINT + 'board/createTask';
    public static readonly SAVE_TASK_CHANGES: string = this.END_POINT + 'board/saveTaskChanges';
    public static readonly GET_USER_ROLE: string = this.END_POINT + 'board/getUserRole';
    public static readonly GET_TASK_TYPES: string = this.END_POINT + 'board/getTaskTypes';
    public static readonly GET_BOARD_VIEW: string = this.END_POINT + 'board/getBoardView';

    public static readonly GET_PROJECTS_FOR_EMPOLYEE: string = this.END_POINT + 'userProjectsSelection/getProjects';

    public static readonly GET_USER_STATES: string = this.END_POINT + 'userPage/getUserStates';
    public static readonly SAVE_USER_INFO_CHANGES: string = this.END_POINT + 'userPage/saveUserInfoChanges';
    public static readonly GET_USER_INFO: string = this.END_POINT + 'userPage/getUserInfo';
    public static readonly CREATE_CHANGE_USER_ROLE_REQUEST: string = this.END_POINT + 'userPage/createChangeUserRoleRequest';

}