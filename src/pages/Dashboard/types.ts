export interface Sprint {
  id: number;
  name: string;
  startDate: string | null;
  endDate: string | null;
  activatedAt: string | null;
}

export interface MyTask {
  id: number;
  idTask: string;
  title: string;
  status: string;
  priority: {
    name: string;
    label: string;
  } | null;
  deadline: string | null;
  epicKey?: string;
}

export interface StatusCount {
  name: string;
  count: number;
}

export interface PriorityCount {
  name: string;
  label?: string;
  count: number;
}

export interface TypeCount {
  name: string;
  count: number;
}

export interface EpicProgress {
  id: number;
  key: string;
  title: string;
  total: number;
  done: number;
  pct: number;
}

export interface RecentActivity {
  id: number;
  idTask: string;
  title: string;
  status: string;
  assignee?: string;
  updatedAt: string;
}

export interface DashboardData {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  upcomingTasks: number;
  activeSprint: Sprint | null;
  myTasks: MyTask[];
  tasksByStatus: StatusCount[];
  tasksByPriority: PriorityCount[];
  tasksByType: TypeCount[];
  epicProgress: EpicProgress[];
  recentActivity: RecentActivity[];
}