import { useEffect, useState } from "react";
import axios from "axios";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from "recharts";
import { Card, CardContent } from "../components/ui/card";
import Spinner from "../components/ui/Spinner";

const COLORS = ["#a5b4fc", "#6ee7b7", "#fcd34d", "#fda4af", "#93c5fd"];
const SECTORS = ["AC/V", "AC/E"];

export default function StatsPage() {
  const [sector, setSector] = useState(SECTORS[0]);
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().slice(0, 10);
  });
  const [toDate, setToDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [stats, setStats] = useState(null);
  const [keyword, setKeyword] = useState("fuite");
  const [topKeywordMachines, setTopKeywordMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingKeyword, setLoadingKeyword] = useState(true);

  // Fetch stats when sector or dates change
  useEffect(() => {
    setLoading(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/stats`, {
        params: { sector, from: fromDate, to: toDate },
      })
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Erreur chargement stats:", err))
      .finally(() => setLoading(false));
  }, [sector, fromDate, toDate]);

  // Fetch top-keyword machines
  useEffect(() => {
    setLoadingKeyword(true);
    axios
      .get(`${import.meta.env.VITE_API_URL}/stats/top-keyword`, {
        params: { sector, keyword, from: fromDate, to: toDate },
      })
      .then((res) => setTopKeywordMachines(res.data.results))
      .catch((err) => console.error("Erreur chargement mots-clés:", err))
      .finally(() => setLoadingKeyword(false));
  }, [sector, keyword, fromDate, toDate]);

  // Trends
  const anomalyDelta = stats
    ? stats.currentMonthAnomalies - stats.prevMonthAnomalies
    : 0;
  const safetyDelta = stats
    ? stats.currentMonthSafety - stats.prevMonthSafety
    : 0;
  const anomalyTrend = anomalyDelta > 0 ? "🔺" : anomalyDelta < 0 ? "🔻" : "⏸️";
  const safetyTrend = safetyDelta > 0 ? "🔺" : safetyDelta < 0 ? "🔻" : "⏸️";

  // Export stats as JSON
  const handleExport = () => {
    if (!stats) return;
    const blob = new Blob([JSON.stringify(stats, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `stats_${sector}_${fromDate}_${toDate}.json`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      {/* Header with filters and export */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Statistiques</h2>
        <div className="flex items-center gap-2">
          <select
            value={sector}
            onChange={(e) => setSector(e.target.value)}
            className="px-3 py-1 border rounded-md text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {SECTORS.map((s) => (
              <option key={s} value={s}>
                Secteur {s}
              </option>
            ))}
          </select>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none"
          />
          <span>→</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-white focus:outline-none"
          />
          <button
            onClick={handleExport}
            className="ml-2 px-3 py-1 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700 transition"
          >
            Export JSON
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Top machines */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Top machines signalées</h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={stats.topMachines}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <XAxis type="number" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="machine_tag"
                  width={100}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip />
                <Bar dataKey="count" name="Nombre">
                  {stats.topMachines.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Moyennes & Totaux étendus */}
        <Card className="animate-fade-in-up md:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4 text-center">KPI</h3>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                  Moy. anomalies / rapport
                </div>
                <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.avgAnomaliesPerReport}
                </div>
              </div>
              <div className="bg-green-50 dark:bg-emerald-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                  Rapports générés
                </div>
                <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.totalReports}
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                  Anomalies signalées
                </div>
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.totalAnomalies} {anomalyTrend}
                </div>
              </div>
              <div className="bg-red-50 dark:bg-rose-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                  Anomalies classiques
                </div>
                <div className="text-2xl font-bold text-rose-600 dark:text-rose-400">
                  {stats.totalEntries}
                </div>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                  Anomalies Grosses Machines
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {stats.totalHeavy}
                </div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">
                  Événements sécurité
                </div>
                <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.totalSafety} {safetyTrend}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Anomalies par jour */}
        <Card className="animate-fade-in-up md:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Anomalies par jour</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart
                data={stats.dailyEvolution}
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="anomalies"
                  name="Anomalies"
                  stroke="#6366F1"
                />
                <Line
                  type="monotone"
                  dataKey="safety"
                  name="Sécurité"
                  stroke="#F59E0B"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Sécurité */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Événements de sécurité</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={stats.safetyTypes}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.safetyTypes.map((_, i) => (
                    <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top machines par mot‑clé */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Top machine par mot-clé</h3>
              <select
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-900 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
              >
                {["fuite", "appoint", "vibration", "concrétion", "bruit"].map(
                  (k) => (
                    <option key={k} value={k}>
                      {k}
                    </option>
                  )
                )}
              </select>
            </div>

            {loadingKeyword ? (
              <Spinner />
            ) : topKeywordMachines.length === 0 ? (
              <p className="text-sm text-gray-500 italic">
                Aucune donnée pour ce mot-clé.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart
                  data={topKeywordMachines}
                  layout="vertical"
                  margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
                >
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="machine_tag"
                    width={100}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip />
                  <Bar dataKey="count" name="Nombre">
                    {topKeywordMachines.map((_, i) => (
                      <Cell
                        key={`cell-${i}`}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Évolution mensuelle */}
        <Card className="animate-fade-in-up col-span-1 md:col-span-2 lg:col-span-3">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Évolution mensuelle</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart margin={{ top: 0, right: 16, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="month"
                  tick={{ fontSize: 12 }}
                  interval="preserveStartEnd"
                />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line
                  data={stats.anomaliesPerMonth}
                  dataKey="count"
                  name="Anomalies"
                  stroke="#6366F1"
                  dot={{ r: 2 }}
                />
                <Line
                  data={stats.safetyPerMonth}
                  dataKey="count"
                  name="Sécurité"
                  stroke="#10B981"
                  dot={{ r: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}