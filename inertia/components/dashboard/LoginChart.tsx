import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '~/components/ui/card'

interface LoginData {
  date: string
  success: number
  failed: number
}

interface LoginChartProps {
  data: LoginData[]
}

export function LoginChart({ data }: LoginChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Login Activity</CardTitle>
        <CardDescription>Last 7 days login attempts</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip />
            <Legend wrapperStyle={{ color: '#374151' }} />
            <Bar
              dataKey="success"
              fill="#86efac"
              fillOpacity={0.85}
              stroke="#22c55e"
              strokeWidth={1}
              name="Success"
              radius={[3, 3, 0, 0]}
            />
            <Bar
              dataKey="failed"
              fill="#fca5a5"
              fillOpacity={0.85}
              stroke="#ef4444"
              strokeWidth={1}
              name="Failed"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
