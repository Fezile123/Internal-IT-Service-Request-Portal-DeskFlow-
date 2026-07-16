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

const COLORS = [
  '#3B82F6',
  '#F59E0B',
  '#10B981',
  '#8B5CF6',
  '#EF4444',
];

export default function AnalyticsPanel({ tickets }) {
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
      ? ((resolved / total) * 100).toFixed(1)
      : 0;

  const highPriorityOpen = tickets.filter(
    (t) =>
      t.priority === 'High' &&
      t.status !== 'Resolved'
  ).length;

  const statusData = [
    { name: 'Open', value: open },
    { name: 'In Progress', value: inProgress },
    { name: 'Resolved', value: resolved },
  ];

  const priorityData = [
    { name: 'Low', value: low },
    { name: 'Medium', value: medium },
    { name: 'High', value: high },
  ];

  const categoryData = [
    { name: 'Software', value: software },
    { name: 'Hardware', value: hardware },
    { name: 'Network', value: network },
    { name: 'Account Access', value: accountAccess },
    { name: 'Other', value: other },
  ];

  return (
    <div className="space-y-6">

      {/* KPI CARDS */}
      <div className="grid md:grid-cols-5 gap-4">
        <Metric title="Total Tickets" value={total} />
        <Metric title="Open" value={open} />
        <Metric title="In Progress" value={inProgress} />
        <Metric title="Resolved" value={resolved} />
        <Metric
          title="High Priority Open"
          value={highPriorityOpen}
        />
      </div>

      {/* ALERT */}
      {highPriorityOpen > 0 && (
        <div className="card p-4 border border-red-500">
          <h3 className="font-semibold text-red-400">
            Attention Required
          </h3>

          <p className="text-sm text-gray-400 mt-2">
            There are {highPriorityOpen} unresolved
            high-priority tickets that require
            immediate attention.
          </p>
        </div>
      )}

      {/* RESOLUTION RATE */}
      <div className="card p-5">
        <h3 className="font-semibold mb-2">
          Resolution Rate
        </h3>

        <p className="text-5xl font-bold text-emerald-400">
          {resolutionRate}%
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Percentage of tickets resolved.
        </p>
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-3 gap-6">

        <div className="card p-5">
          <h3 className="font-semibold mb-4">
            Status Distribution
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                outerRadius={80}
              >
                {statusData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-semibold mb-4">
            Priority Breakdown
          </h3>

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={priorityData}>
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

          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* RECENT TICKETS */}
      <div className="card p-5">
        <h3 className="font-semibold mb-4">
          Latest Tickets
        </h3>

        <div className="space-y-3">
          {tickets.slice(0, 8).map((ticket) => (
            <div
              key={ticket.id}
              className="flex justify-between items-center border-b border-surface-border pb-2"
            >
              <div>
                <p className="font-medium">
                  {ticket.title}
                </p>

                <p className="text-xs text-gray-500">
                  {ticket.category || 'Other'}
                </p>
              </div>

              <div className="text-right">
                <p className="text-sm">
                  {ticket.status}
                </p>

                <p className="text-xs text-gray-500">
                  {ticket.priority}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

function Metric({ title, value }) {
  return (
    <div className="card p-5">
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-3xl font-bold mt-2">
        {value}
      </p>
    </div>
  );
}