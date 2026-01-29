import React from 'react'


interface StatsCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}



function StatsCard({ title, value, icon, color }: StatsCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
      <div
        className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}
      >
        {icon}
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  )
}

export default StatsCard
