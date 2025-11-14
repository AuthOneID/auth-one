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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="success" fill="#10b981" name="Success" />
            <Bar dataKey="failed" fill="#ef4444" name="Failed" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
