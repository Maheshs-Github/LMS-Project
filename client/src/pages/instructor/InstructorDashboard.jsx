import LineChart from '@/components/common/Charts'
import { revenueAnalytics, studentAnalytics } from '@/resources/Data'
import React from 'react'

const InstructorDashboard = () => {
  return (

    <div className="w-full flex flex-col gap-6 p-6">
      <div className="grid lg:grid-cols-5 w-full gap-5">
        <div className="p-5 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
          <div className="text-lg">Total Sales</div>
          <div className="font-semibold text-blue-600 text-lg">3</div>
        </div>
        <div className="p-3 shadow-md rounded-lg col-span-1 flex flex-col gap-4 ">
          <div className="text-lg">Total Revenue</div>
          <div className="font-semibold text-blue-600 text-lg">312241</div>
        </div>
      </div>
      <div className="grid gap-6 w-full min-w-0 overflow-hidden ">

      <LineChart
        title={studentAnalytics.title}
        categories={studentAnalytics.categories}
        series={studentAnalytics.series}
      />

      <LineChart
        title={revenueAnalytics.title}
        categories={revenueAnalytics.categories}
        series={revenueAnalytics.series}
      />

    </div>
    </div>


  )
}

export default InstructorDashboard
