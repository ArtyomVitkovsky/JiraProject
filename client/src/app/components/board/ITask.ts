export interface ITask {
    id: string,
    project_id: string,
    task_name: string,
    task_description: string,
    employee_id: string,
    permformer_first_name: string,
    permformer_last_name: string,
    pm_email: string,
    createdAt: string,
    updatedAt: string,
    column_index: number,
    task_type_id: string,
    task_type: string,
    estimated_hours: number,
    logged_hours: number
}

