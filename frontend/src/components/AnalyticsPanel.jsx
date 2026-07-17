import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from 'recharts';

import {
  Ticket,
  AlertTriangle,
  Clock3,
  CheckCircle2,
  BarChart3,
} from 'lucide-react';

const COLORS = [
  '#3B82F6',
  '#F59E0B',
  '#10B981',
  '#8B5CF6',
  '#EF4444',
];

export default function AnalyticsPanel({
  tickets,
}) {
  const total = tickets.length;

  const open = tickets.filter(
    (t) => t.status === 'Open'
  ).length;

  const inProgress = tickets.filter(
    (t) => t.status === 'In Progress'
  ).length;

  const resolved = tickets.filter(
    (t) => t.status === 'Resolved'
  ).length;

  const low = tickets.filter(
    (t) => t.priority === 'Low'
  ).length;

  const medium = tickets.filter(
    (t) => t.priority === 'Medium'
  ).length;

  const high = tickets.filter(
    (t) => t.priority === 'High'
  ).length;

  const software = tickets.filter(
    (t) => t.category === 'Software'
  ).length;

  const hardware = tickets.filter(
    (t) => t.category === 'Hardware'
  ).length;

  const network = tickets.filter(
    (t) => t.category === 'Network'
  ).length;

  const accountAccess = tickets.filter(
    (t) => t.category === 'Account Access'
  ).length;

  const other = tickets.filter(
    (t) => t.category === 'Other'
  ).length;

  const resolutionRate =
    total > 0
      ? (
          (resolved / total) *
          100
        ).toFixed(1)
      : 0;

  const highPriorityOpen =
    tickets.filter(
      (t) =>
        t.priority === 'High' &&
        t.status !== 'Resolved'
    ).length;

  const statusData = [
    {
      name: 'Open',
      value: open,
    },
    {
      name: 'In Progress',
      value: inProgress,
    },
    {
      name: 'Resolved',
      value: resolved,
    },
  ];

  const priorityData = [
    {
      name: 'Low',
      value: low,
    },
    {
      name: 'Medium',
      value: medium,
    },
    {
      name: 'High',
      value: high,
    },
  ];

  const categoryData = [
    {
      name: 'Software',
      value: software,
    },
    {
      name: 'Hardware',
      value: hardware,
    },
    {
      name: 'Network',
      value: network,
    },
    {
      name: 'Account Access',
      value: accountAccess,
    },
    {
      name: 'Other',
      value: other,
    },
  ];

  return (
    <div className="space-y-6">

      {/* KPI CARDS */}

      <div className="grid md:grid-cols-5 gap-4">

        <Metric
          title="Total Tickets"
          value={total}
          icon={Ticket}
          color="text-purple-400"
        />

        <Metric
          title="Open"
          value={open}
          icon={AlertTriangle}
          color="text-blue-400"
        />

        <Metric
          title="In Progress"
          value={inProgress}
          icon={Clock3}
          color="text-amber-400"
        />

        <Metric
          title="Resolved"
          value={resolved}
          icon={CheckCircle2}
          color="text-emerald-400"
        />

        <Metric
          title="Critical Open"
          value={highPriorityOpen}
          icon={BarChart3}
          color="text-red-400"
        />

      </div>

      {/* ALERT */}

      {highPriorityOpen > 0 && (
        <div className="card p-5 border border-red-500/40">

          <h3 className="font-semibold text-red-400">
            Immediate Attention Required
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            There are {
              highPriorityOpen
            } unresolved high-priority
            tickets requiring action.
          </p>

        </div>
      )}

      {/* RESOLUTION RATE */}

      <div className="card p-6">

        <div className="flex justify-between mb-3">

          <h3 className="font-semibold">
            Resolution Rate
          </h3>

          <span className="text-emerald-400 font-semibold">
            {resolutionRate}%
          </span>

        </div>

        <div className="w-full h-3 bg-surface-border rounded-full overflow-hidden">

          <div
            className="h-full bg-emerald-500"
            style={{
              width: `${resolutionRate}%`,
            }}
          />

        </div>

      </div>

      {/* CHARTS */}

      <div className="grid lg:grid-cols-3 gap-6">

        <div className="card p-5">
          <h3 className="font-semibold mb-4">
            Status Distribution
          </h3>

          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={80}
              >
                {statusData.map(
                  (entry, index) => (
                    <Cell
                      key={index}
                      fill={
                        COLORS[index]
                      }
                    />
                  )
                )}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4">
            Priority Breakdown
          </h3>

          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <BarChart
              data={priorityData}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4">
            Category Breakdown
          </h3>

          <ResponsiveContainer
            width="100%"
            height={250}
          >
            <BarChart
              data={categoryData}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}

function Metric({
  title,
  value,
  icon: Icon,
  color,
}) {
  return (
    <div className="card p-5">

      <div className="flex justify-between items-center">

        <div>
          <p className="text-sm text-gray-500">
            {title}
          </p>

          <p className="text-3xl font-bold mt-2">
            {value}
          </p>
        </div>

        <div
          className={`p-3 rounded-xl bg-surface-border ${color}`}
        >
          <Icon size={20} />
        </div>

      </div>

    </div>
  );
}