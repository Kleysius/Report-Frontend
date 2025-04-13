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

const COLORS = [
  "#a5b4fc", // violet clair
  "#6ee7b7", // vert menthe
  "#fcd34d", // jaune
  "#fda4af", // rose
  "#93c5fd"  // bleu clair
];

export default function StatsPage() {
  const [sector, setSector] = useState("AC/V");
  const [stats, setStats] = useState(null);
  const [keyword, setKeyword] = useState("fuite");
  const [topKeywordMachines, setTopKeywordMachines] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/stats?sector=${sector}`
        );
        setStats(res.data);
      } catch (err) {
        console.error("Erreur chargement stats:", err);
      }
    };
    fetchStats();
  }, [sector]);

  useEffect(() => {
    const fetchKeywordMachines = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/stats/top-keyword?sector=${sector}&keyword=${keyword}`
        );
        setTopKeywordMachines(res.data.results);
      } catch (err) {
        console.error("Erreur chargement mots-clés:", err);
      }
    };
    fetchKeywordMachines();
  }, [sector, keyword]);

  if (!stats) return <div className="p-4 text-center">Chargement...</div>;

  const anomalyDelta = stats.currentMonthAnomalies - stats.prevMonthAnomalies;
  const anomalyTrend = anomalyDelta > 0 ? "🔺" : anomalyDelta < 0 ? "🔻" : "⏸️";

  const safetyDelta = stats.currentMonthSafety - stats.prevMonthSafety;
  const safetyTrend = safetyDelta > 0 ? "🔺" : safetyDelta < 0 ? "🔻" : "⏸️";

  return (
    <div className="p-4 max-w-screen-xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold">Statistiques</h2>
        <select
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          className="px-3 py-1 border rounded-md text-sm dark:bg-gray-900 dark:border-gray-700 dark:text-white transition-colors duration-500 ease-in-out"
        >
          <option value="AC/V">Secteur AC/V</option>
          <option value="AC/E">Secteur AC/E</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bloc 1 — Top machines */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Top machines signalées</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats.topMachines} layout="vertical">
                <XAxis type="number" allowDecimals={false} />
                <YAxis type="category" dataKey="machine_tag" width={80} />
                <Tooltip />
                <Bar dataKey="count" name="Nombre">
                  {stats.topMachines.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bloc 2 — Zones */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Zones les plus touchées</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats.zones}
                  dataKey="count"
                  nameKey="zone"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {stats.zones.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bloc 3 — Sécurité */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">
              Répartition des événements de sécurité
            </h3>
            <ResponsiveContainer width="100%" height={250}>
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
                  {stats.safetyTypes.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bloc 4 — Anomalies par jour */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Anomalies par jour</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats.dailyEvolution}>
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="anomalies" name="Anomalies" stroke="#8884d8" />
                <Line type="monotone" dataKey="safety" name="Sécurité" stroke="#ff8042" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bloc 5 — Moyenne anomalies & Totaux */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4 text-center">📊 Moyenne & Totaux</h3>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Moy. anomalies par rapport</div>
                <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
                  {stats.avgAnomaliesPerReport || 0}
                </div>
              </div>

              <div className="bg-green-50 dark:bg-emerald-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Rapports générés</div>
                <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.totalReports}
                </div>
              </div>

              <div className="bg-rose-50 dark:bg-rose-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Anomalies signalées</div>
                <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">
                  {stats.totalAnomalies} <span className="ml-2 text-xl">{anomalyTrend}</span>
                </div>
              </div>

              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                <div className="text-sm text-gray-500 dark:text-gray-300 mb-1">Événements sécurité</div>
                <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                  {stats.totalSafetyEvents} <span className="ml-2 text-xl">{safetyTrend}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bloc 6 — Top machines par mot-clé */}
        <Card className="animate-fade-in-up">
          <CardContent className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-medium">Top machines par mot-clé</h3>
              <select
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="border rounded-md px-2 py-1 text-sm dark:bg-gray-900 dark:border-gray-700"
              >
                <option value="fuite">Fuite</option>
                <option value="appoint">Appoint</option>
                <option value="vibration">Vibration</option>
                <option value="concrétion">Concrétion</option>
                <option value="bruit">Bruit</option>
              </select>
            </div>
            {topKeywordMachines.length === 0 ? (
              <p className="text-sm text-gray-500 italic">Aucune donnée pour ce mot-clé.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={topKeywordMachines} layout="vertical">
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="machine_tag" width={120} />
                  <Tooltip />
                  <Bar dataKey="count" name="Nombre">
                    {stats.topMachines.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Bloc 7 — Total anomalies et sécurité par mois */}
        <Card className="animate-fade-in-up col-span-1 md:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-3">Évolution mensuelle</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart>
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" data={stats.anomaliesPerMonth} dataKey="count" name="Anomalies" stroke="#6366f1" />
                <Line type="monotone" data={stats.safetyPerMonth} dataKey="count" name="Événements sécurité" stroke="#10b981" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}